export interface Idea {
  _id: string; // need underscore with mongo
  title: string;
  summary: string;
  description: string;
  tags: string[];
  createdAt: string;
  user: string;
}
