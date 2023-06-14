import { Component ,OnInit} from '@angular/core';
import { category } from './category';
import { CategoryService } from '../service/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
  providers :[CategoryService]
})
export class CategoryComponent implements OnInit {

  constructor(private categoryService:CategoryService){}
  catogeries:category[] =[]
 
 
  ngOnInit(){
    this.categoryService.getCatagories().subscribe(data => this.catogeries = data);
  }

  

}
