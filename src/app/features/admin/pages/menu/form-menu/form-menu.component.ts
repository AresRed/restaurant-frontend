import { CommonModule } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { CategoryResponse } from '../../../../../core/models/category.model';
import { FileResponse } from '../../../../../core/models/file/file.model';
import { IngredientResponse } from '../../../../../core/models/products/product/ingredient/ingredient.model';
import {
  ProductRequest,
  ProductResponse,
} from '../../../../../core/models/products/product/product.model';
import { FileService } from '../../../../../core/services/aws/file.service';
import { CategoryService } from '../../../../../core/services/category.service';
import { IngredientService } from '../../../../../core/services/ingredient.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { ProductService } from '../../../../../core/services/products/product/product.service';

@Component({
  selector: 'app-form-menu',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    DropdownModule,
    SelectModule,
    CardModule,
    ToastModule,
    TextareaModule,
    FileUploadModule,
  ],
  templateUrl: './form-menu.component.html',
  styleUrl: './form-menu.component.scss',
})
export class FormMenuComponent {
  form!: FormGroup;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  product: ProductResponse | null = null;
  ingredientsList: IngredientResponse[] = [];
  categories: CategoryResponse[] = [];
  selectedImageUrl: string | null = null;
  isEditMode = false;
  title = 'Registrar Producto';
  loading = false;

  uploadProgress = 0;
  uploadedFile: FileResponse | null = null;
  tempUploadedFileId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService,
    private ingredientService: IngredientService,
    private fileService: FileService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadCategories();
    this.loadIngredients();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.title = 'Editar Producto';
      this.loadProduct(Number(id));
    }
  }

  loadIngredients() {
    this.ingredientService.getAllIngredients().subscribe({
      next: (res) => {
        this.ingredientsList = res.data;
      },
      error: () =>
        this.notificationService.error(
          'Error',
          'No se pudieron cargar los ingredientes'
        ),
    });
  }

  buildForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      categoryId: [null, Validators.required],
      price: [0, [Validators.required, Validators.min(0.1)]],
      preparationTimeMinutes: [5, [Validators.required, Validators.min(1)]],
      imageUrl: [''],
      ingredients: this.fb.array([]),
      active: [true],
    });
  }

  get ingredients(): FormArray {
    return this.form.get('ingredients') as FormArray;
  }

  addIngredient(ing?: any) {
    this.ingredients.push(
      this.fb.group({
        ingredientId: [ing?.ingredientId || null, Validators.required],
        ingredientName: [ing?.ingredientName || '', Validators.required],
        quantity: [
          ing?.quantity || 1,
          [Validators.required, Validators.min(0.1)],
        ],
        unitName: [ing?.unitName || '', Validators.required],
      })
    );
  }

  onIngredientSelect(event: any, index: number) {
    const selectedId = event.value;
    const selected = this.ingredientsList.find((i) => i.id === selectedId);
    const group = this.ingredients.at(index) as FormGroup;

    if (selected) {
      group.patchValue({
        ingredientName: selected.name,
        unitName: selected.unitName,
      });
    }
  }

  removeIngredient(index: number) {
    this.ingredients.removeAt(index);
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (res) => {
        this.categories = res.data;
      },
      error: () =>
        this.notificationService.error('Error', 'Error al cargar categorías'),
    });
  }

  loadProduct(id: number) {
    this.loading = true;
    this.productService.getProduct(id).subscribe({
      next: (res) => {
        this.loading = false;
        this.product = res.data;

        if (!this.product) {
          this.notificationService.error('Error', 'Producto no encontrado');
          this.router.navigate(['/admin/menu']);
          return;
        }

        this.form.patchValue({
          name: this.product.name,
          description: this.product.description,
          price: this.product.price,
          imageUrl: this.product.imageUrl,
          categoryId: this.product.categoryId,
          preparationTimeMinutes: this.product.preparationTimeMinutes,
          active: this.product.active,
        });

        this.selectedImageUrl = this.product.imageUrl || null;

        this.ingredients.clear();
        if (this.product.ingredients) {
          this.product.ingredients.forEach((ing) => this.addIngredient(ing));
        }
      },
      error: () => {
        this.loading = false;
        this.notificationService.error(
          'Error',
          'No se pudo cargar el producto'
        );
        this.router.navigate(['/admin/menu']);
      },
    });
  }

  onImageUpload(event: any) {
    const file = event.target.files?.[0];
    if (!file) return;

    this.uploadProgress = 0;
    this.notificationService.info('Subiendo imagen...', 'Por favor espera.');

    this.fileService.uploadFileWithProgress(file, 'products').subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round((100 * event.loaded) / event.total);
        } else if (event.type === HttpEventType.Response) {
          const res = event.body;
          if (res?.success && res.data) {
            this.uploadedFile = res.data;
            this.tempUploadedFileId = res.data.id;
            this.selectedImageUrl = res.data.fileUrl;
            this.form.patchValue({ imageUrl: res.data.fileUrl });
            this.notificationService.success(
              'Imagen subida',
              'La imagen fue subida exitosamente.'
            );
          } else {
            this.notificationService.error(
              'Error',
              'No se pudo subir la imagen.'
            );
          }
        }
      },
      error: (err) => {
        console.error(err);
        this.notificationService.error('Error', 'Error al subir la imagen.');
      },
    });
  }

  onRemoveImage() {
    if (this.uploadedFile) {
      this.fileService.deleteFile(this.uploadedFile.id).subscribe({
        next: () => {
          this.notificationService.success(
            'Imagen eliminada',
            'La imagen se eliminó correctamente.'
          );
          this.selectedImageUrl = null;
          this.form.patchValue({ imageUrl: '' });
          this.uploadedFile = null;
          this.tempUploadedFileId = null;
        },
        error: () => {
          this.notificationService.error(
            'Error',
            'No se pudo eliminar la imagen.'
          );
        },
      });
    } else {
      this.selectedImageUrl = null;
      this.form.patchValue({ imageUrl: '' });
    }
  }
  onSubmit() {
    if (this.form.invalid) {
      this.notificationService.warn(
        'Campos incompletos',
        'Por favor completa todos los campos obligatorios.'
      );
      return;
    }

    const request = this.buildProductRequest();
    this.loading = true;

    const obs =
      this.isEditMode && this.product
        ? this.productService.updateProduct(this.product.id, request)
        : this.productService.addProduct(request);

    obs.subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.notificationService.success(
            this.isEditMode ? 'Actualizado' : 'Creado',
            this.isEditMode
              ? 'El producto se actualizó correctamente.'
              : 'El producto se registró correctamente.'
          );
          this.router.navigate(['/admin/menu']);
        } else {
          this.notificationService.error('Error', 'Operación fallida.');
          this.cleanupTempImage();
        }
      },
      error: (err) => {
        this.loading = false;
        this.notificationService.error(
          'Error',
          err?.error?.message || 'Ocurrió un error inesperado.'
        );
        this.cleanupTempImage();
      },
    });
  }

  private cleanupTempImage() {
    if (this.tempUploadedFileId) {
      this.fileService.deleteFile(this.tempUploadedFileId).subscribe({
        next: () => {
          console.log('🧹 Imagen temporal eliminada');
          this.tempUploadedFileId = null;
        },
        error: () => console.warn('⚠️ No se pudo eliminar imagen temporal'),
      });
    }
  }

  private buildProductRequest(): ProductRequest {
    const raw = this.form.value;

    return {
      name: raw.name,
      description: raw.description,
      price: raw.price,
      imageUrl: raw.imageUrl || '',
      active: raw.active,
      categoryId: raw.categoryId,
      preparationTimeMinutes: raw.preparationTimeMinutes,
      ingredients: raw.ingredients.map((ing: any) => ({
        ingredientId: ing.ingredientId,
        quantity: ing.quantity,
      })),
    };
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onCancel() {
    this.router.navigate(['/admin/menu']);
  }
}
