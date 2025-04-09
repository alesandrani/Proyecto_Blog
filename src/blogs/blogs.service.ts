import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BlogDto } from './dto/blog.dto';

@Injectable()
export class BlogsService {
    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async createBlog(blogDto: BlogDto, userId: number) {
        return await this.prisma.blog.create({
            data: {
                name: blogDto.name,
                userId: userId
            }
        });
    }

    async findAllBlogs() {
        return await this.prisma.blog.findMany({
            include: {
                user: true,
                posts: true
            }
        });
    }

    async findBlogWithPosts(blogId: number) {
        const blog = await this.prisma.blog.findUnique({
            where: { id: blogId },
            include: {
                posts: true,
                user: true
            }
        });

        if (!blog) {
            throw new NotFoundException('Blog no encontrado');
        }

        return blog;
    }

    async updateBlog(blogId: number, blogDto: BlogDto, userId: number) {
        const blog = await this.prisma.blog.findUnique({
            where: { id: blogId }
        });

        if (!blog) {
            throw new NotFoundException('Blog no encontrado');
        }

        if (blog.userId !== userId) {
            throw new ForbiddenException('No tienes permiso para actualizar este blog');
        }

        return await this.prisma.blog.update({
            where: { id: blogId },
            data: {
                name: blogDto.name
            }
        });
    }

    async deleteBlog(blogId: number, userId: number) {
        const blog = await this.prisma.blog.findUnique({
            where: { id: blogId }
        });

        if (!blog) {
            throw new NotFoundException('Blog no encontrado');
        }

        if (blog.userId !== userId) {
            throw new ForbiddenException('No tienes permiso para eliminar este blog');
        }

        await this.prisma.blog.delete({
            where: { id: blogId }
        });
    }
}
