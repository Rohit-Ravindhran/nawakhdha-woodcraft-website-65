
import { format } from "date-fns";
import { BlogFormValues } from "@/components/admin/schemas/blogSchema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface BlogTableProps {
  blogs: BlogFormValues[] | undefined;
  onEdit: (blog: BlogFormValues) => void;
  onDelete: (id: string) => void;
}

export default function BlogTable({ blogs, onEdit, onDelete }: BlogTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Featured Image</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {blogs && blogs.length > 0 ? (
          blogs.map((blog) => (
            <TableRow key={blog.id}>
              <TableCell>
                <div className="w-16 h-16 relative bg-gray-200 rounded overflow-hidden">
                  {blog.featured_image_url ? (
                    <img 
                      src={blog.featured_image_url} 
                      alt={blog.alt_text || 'Blog image'} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No img
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="font-medium">{blog.title || 'N/A'}</TableCell>
              <TableCell>{blog.slug || 'N/A'}</TableCell>
              <TableCell>{blog.date ? format(new Date(blog.date), 'MMM d, yyyy') : 'N/A'}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(blog)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onDelete(blog.id!)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-4">
              No blog posts found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
