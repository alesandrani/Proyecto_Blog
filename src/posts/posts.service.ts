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
    return this.prisma.$transaction(async (tx) => {
      const blog = await tx.blog.findUnique({
        where: { id: createPostDto.blogId },
        select: { id: true, userId: true },
      });

      if (!blog) {
        throw new NotFoundException('Blog not found');
      }

      return tx.post.create({
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
          blog: {
            select: {
              id: true,
              name: true,
              userId: true,
            },
          },
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
        blog: {
          select: {
            id: true,
            name: true,
            userId: true,
          },
        },
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
        blog: {
          select: {
            id: true,
            name: true,
            userId: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto, userId: number) {
    return this.prisma.$transaction(async (tx) => {
      const post = await tx.post.findUnique({
        where: { id },
        include: {
          blog: {
            select: {
              userId: true,
            },
          },
        },
      });

      if (!post) {
        throw new NotFoundException('Post not found');
      }

      // Check if user is post owner or blog owner
      if (post.userId !== userId && post.blog.userId !== userId) {
        throw new ForbiddenException('You do not have permission to update this post');
      }

      return tx.post.update({
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
          blog: {
            select: {
              id: true,
              name: true,
              userId: true,
            },
          },
        },
      });
    });
  }

  async remove(id: number, userId: number) {
    return this.prisma.$transaction(async (tx) => {
      const post = await tx.post.findUnique({
        where: { id },
        include: {
          blog: {
            select: {
              userId: true,
            },
          },
        },
      });

      if (!post) {
        throw new NotFoundException('Post not found');
      }

      // Check if user is post owner or blog owner
      if (post.userId !== userId && post.blog.userId !== userId) {
        throw new ForbiddenException('You do not have permission to delete this post');
      }

      await tx.post.delete({
        where: { id },
      });

      return { message: 'Post deleted successfully' };
    });
  }
}
