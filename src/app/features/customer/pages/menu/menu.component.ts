import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface PowerItem {
  name: string;
  description: string;
  price: number;
  iconContent: string; 
  isNew?: boolean;
}

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements AfterViewInit {
  categories = [
    'Categoria 1',
    'Categoria 2',
    'Categoria 3',
    'Categoria 4',
    'Categoria 5',
    'Categoria 6',
  ];

  powerItems: PowerItem[] = [
    {
      name: 'Power Chuleta Criolla',
      description:
        '1 Chuleta Criolla + 2 lonjas de Plátano Frito + 1 Porción de Arroz + 1 Porción de Papas Perejileras',
      price: 24.5,
      iconContent: 'chifita.jpg', 
      isNew: true,
    },
    {
      name: 'Power Hamburguesa',
      description: 'Hamburguesa doble + papas fritas + bebida refrescante',
      price: 22,
      iconContent: 'chifita.jpg', 
    },
    {
      name: 'Power Pizza',
      description: 'Pizza familiar + 2 bebidas + aderezo especial',
      price: 35,
      iconContent: 'chifita.jpg', 
    },
    {
      name: 'Power Tacos',
      description: '3 Tacos de carne + guarnición de arroz + salsa especial',
      price: 28,
      iconContent: 'chifita.jpg', 
    },
    {
      name: 'Power Ensalada',
      description: 'Ensalada grande + aderezo + semillas + bebida natural',
      price: 20,
      iconContent: 'chifita.jpg', 
    },
    {
      name: 'Power Camarones',
      description: 'Camarones al ajillo + arroz + ensalada + bebida',
      price: 40,
      iconContent: 'chifita.jpg', 
    },
  ];

  ngAfterViewInit(): void {
    gsap.from('.hero-title', {
      y: 50,
      opacity: 0,
      duration: 0.2,
      ease: 'power3.out',
    });

    setTimeout(() => {
      gsap.utils.toArray('.power-card').forEach((card: any, i) => {
        gsap.fromTo(
          card,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.2,
            delay: i * 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 80%',
            },
          }
        );
      });
    }, 0);
  }
}
