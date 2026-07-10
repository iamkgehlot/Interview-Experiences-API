interface Pagination {
  page: string;
  limit?: string;
}

export interface ExperienceQuery extends Pagination {
  search: string;
  sortBy: string;
  order:string;
  filterBy: string;
  experienceId:string,
  userId:string,
  tagId:number,
  tagName:string
}
