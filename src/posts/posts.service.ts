import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FilterPostDto } from './dto/filter-post.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto, userId: number) {
    return await this.prisma.$transaction(async (prisma) => {
      const blog = await prisma.blog.findUnique({
        where: { id: createPostDto.blogId },
        select: { id: true, userId: true },
      });

      if (!blog) {
        throw new NotFoundException('Blog not found');
      }

      return prisma.post.create({
        data: {
          ...createPostDto,
          userId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          blog: true,
        },
      });
    });
  }

  async findAll(filterDto: FilterPostDto, userId?: number) {
    const where: Prisma.PostWhereInput = {};
    
    if (filterDto.blogId) {
      where.blogId = filterDto.blogId;
    }

    // If userId is provided (user is authenticated) and isActive filter is specified
    if (userId && filterDto.isActive !== undefined) {
      where.isActive = filterDto.isActive;
    } else {
      // For non-authenticated users or when isActive is not specified, show only active posts
      where.isActive = true;
    }

    return this.prisma.post.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        blog: true,
      },
    });
  }

  async findOne(id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        blog: true,
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto, userId: number) {
    return await this.prisma.$transaction(async (prisma) => {
      const post = await prisma.post.findUnique({
        where: { id },
        include: {
          blog: true,
        },
      });

      if (!post) {
        throw new NotFoundException('Post not found');
      }

      // Check if user is post owner or blog owner
      if (post.userId !== userId && post.blog.userId !== userId) {
        throw new ForbiddenException('You do not have permission to update this post');
      }

      return prisma.post.update({
        where: { id },
        data: updatePostDto,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          blog: true,
        },
      });
    });
  }

  async remove(id: number, userId: number) {
    return await this.prisma.$transaction(async (prisma) => {
      const post = await prisma.post.findUnique({
        where: { id },
        include: {
          blog: true,
        },
      });

      if (!post) {
        throw new NotFoundException('Post not found');
      }

      // Check if user is post owner or blog owner
      if (post.userId !== userId && post.blog.userId !== userId) {
        throw new ForbiddenException('You do not have permission to delete this post');
      }

      await prisma.post.delete({
        where: { id },
      });

      return { message: 'Post deleted successfully' };
    });
  }
}
