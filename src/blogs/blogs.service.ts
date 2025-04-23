import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BlogDto } from './dto/blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogsService {
    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async createBlog(blogDto: BlogDto, userId: number) {
        return await this.prisma.blog.create({
            data: {
                title: blogDto.title,
                content: blogDto.content,
                summary: blogDto.summary,
                isPublic: blogDto.isPublic,
                tags: blogDto.tags,
                imageUrl: blogDto.imageUrl,
                userId: userId
            },
            include: {
                user: true
            }
        });
    }

    async findAllBlogs() {
        const blogs = await this.prisma.blog.findMany({
            where: {
                isPublic: true
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        return blogs.map(blog => ({
            ...blog,
            author: {
                id: blog.user.id,
                name: blog.user.name
            }
        }));
    }

    async findBlogWithPosts(blogId: number) {
        const blog = await this.prisma.blog.findUnique({
            where: { id: blogId },
            include: {
                posts: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        if (!blog) {
            throw new NotFoundException('Blog no encontrado');
        }

        const { user, ...blogWithoutUser } = blog;

        return {
            ...blogWithoutUser,
            author: {
                id: user.id,
                name: user.name,
                email: user.email
            },
            posts: blog.posts.map(post => {
                const { user: postUser, ...postWithoutUser } = post;
                return {
                    ...postWithoutUser,
                    author: {
                        id: postUser.id,
                        name: postUser.name,
                        email: postUser.email
                    }
                };
            })
        };
    }

    async updateBlog(blogId: number, blogDto: UpdateBlogDto, userId: number) {
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
                title: blogDto.title,
                content: blogDto.content,
                tags: blogDto.tags,
                imageUrl: blogDto.imageUrl
            },
            include: {
                user: true
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
