import { Controller, Get, Post, Param, Body, Put, Delete, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { DeckService } from './deck.service';
import { CreateDeckDTO } from './dto/create-deck.dto';
import { UpdateDeckDTO } from './dto/update-deck.dto';
import { Deck } from './schemas/deck.schema';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('deck')
@ApiTags("Deck")
export class DeckController {
    constructor(private readonly deckService: DeckService) { }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ description: 'Gets all users collections' })
    async create(
        @Req() req,
        @Body() createDeckDto: CreateDeckDTO
    ): Promise<Deck> {
        const user = req.user;
        if (!user)
            throw new UnauthorizedException('You must be logged in to create a deck');
        else {
            createDeckDto.user_id = user._id;
            return this.deckService.create(createDeckDto);
        }
    }

    @Get(':id')
    async findById(@Param('id') id: string): Promise<Deck> {
        return this.deckService.findById(id);
    }

    @Get('user/:userId')
    async getByUserId(@Param('userId') userId: string): Promise<Deck[]> {
        return this.deckService.getByUserId(userId);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateDeckDto: UpdateDeckDTO): Promise<Deck> {
        return this.deckService.update(id, updateDeckDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        return this.deckService.delete(id);
    }
}
