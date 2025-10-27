import { CommonModule } from '@angular/common';
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
import { IngredientResponse } from '../../../../../core/models/products/product/ingredient/ingredient.model';
import { ProductResponse } from '../../../../../core/models/products/product/product.model';
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
  categories: string[] = [];
  selectedImageUrl: string | null = null;
  isEditMode = false;
  title = 'Registrar Producto';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService,
    private ingredientService: IngredientService,
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
      categoryName: [null, Validators.required],
      price: [0, [Validators.required, Validators.min(0.1)]],
      preparationTimeMinutes: [5, [Validators.required, Validators.min(1)]],
      imageUrl: [''],
      ingredients: this.fb.array([]),
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
        this.categories = res.data.map((c: any) => c.name);
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
        this.product = Array.isArray(res.data) ? res.data[0] : res.data;

        if (!this.product) {
          this.notificationService.error('Error', 'Producto no encontrado');
          this.router.navigate(['/admin/menu']);
          return;
        }

        this.form.patchValue(this.product);
        this.selectedImageUrl = this.product.imageUrl || null;

        if (this.product.ingredients) {
          this.product.ingredients.forEach((ing: any) =>
            this.addIngredient(ing)
          );
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

    const reader = new FileReader();
    reader.onload = () => {
      this.selectedImageUrl = reader.result as string;
      this.form.patchValue({ imageUrl: this.selectedImageUrl });
      this.notificationService.success(
        'Imagen cargada',
        'Vista previa actualizada.'
      );
    };
    reader.readAsDataURL(file);
  }

  onRemoveImage() {
    this.selectedImageUrl = null;
    this.form.patchValue({ imageUrl: '' });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.notificationService.warn(
        'Campos incompletos',
        'Por favor completa todos los campos obligatorios.'
      );
      return;
    }

    const data = this.form.value;

    if (this.isEditMode && this.product) {
      this.notificationService.success(
        'Actualizado',
        'El producto se actualizó correctamente.'
      );
    } else {
      this.notificationService.success(
        'Creado',
        'El producto se registró correctamente.'
      );
    }

    console.log('Datos enviados:', data);
    this.router.navigate(['/admin/menu']);
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }


  onCancel() {
    this.router.navigate(['/admin/menu']);
  }
}
