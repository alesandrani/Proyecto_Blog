import { Controller, Post, Get, Delete, Param, Body, Req, UseGuards, ParseIntPipe, Patch } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogDto } from './dto/blog.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Asegurarse de que el guard existe
import { UpdateBlogDto } from './dto/update-blog.dto';

@Controller('blogs')
export class BlogsController {
    constructor(private readonly blogsService: BlogsService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async createBlog(@Body() blogDto: BlogDto, @Req() req) {
        const userId = req.user.id; // Obtener ID del usuario autenticado
        return await this.blogsService.createBlog(blogDto, userId);
    }

    @Get('public')
    async findPublicBlogs() {
        try {
            return await this.blogsService.findAllBlogs();
        } catch (error) {
            throw error;
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAllBlogs() {
        return await this.blogsService.findAllBlogs();
    }

    @Get(':id')
    async findBlogWithPosts(@Param('id', ParseIntPipe) blogId: number) {
        return await this.blogsService.findBlogWithPosts(blogId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteBlog(@Param('id', ParseIntPipe) blogId: number, @Req() req) {
        const userId = req.user.id; // Obtener ID del usuario autenticado
        return await this.blogsService.deleteBlog(blogId, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async updateBlog(@Param('id', ParseIntPipe) id: number, @Body() updateBlogDto: UpdateBlogDto, @Req() req) {
        const userId = req.user.id;
        return await this.blogsService.updateBlog(id, updateBlogDto, userId);
    }
}
