import {
    Body,
    Controller,
    Get,
    Inject,
    Param,
    Put,
    Req,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import { CollectionService } from './collection.service';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiParam } from '@nestjs/swagger'; // Importar ApiParam
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/auth/schemas/user.schema';
import { Collection } from './schemas/collection.schema';
import { UserHasCardDTO } from './dto/user-has-card.dto';

@Controller('collection')
@ApiTags('Collection')
export class CollectionController {
    constructor(
        private readonly collectionService: CollectionService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) { }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ description: 'Gets all users collections' })
    getCollections(@Req() req): Promise<Collection[]> {
        const user = req.user;
        if (!(user.role === Role.ADMIN))
            throw new UnauthorizedException(
                'Login as admin to access this endpoint',
            );
        else return this.collectionService.getCollections();
    }

    @Get(':user_id')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ description: 'Gets the specified user collection' })
    @ApiParam({ name: 'user_id', description: 'ID of the user', required: true })
    getUserCollection(@Param('user_id') user_id: string, @Req() req) {
        const user = req.user;
        if (user.role === Role.ADMIN || user._id === user_id)
            return this.collectionService.getUserCollection(user_id);
        else
            throw new UnauthorizedException(
                'You can only access your own collection',
            );
    }

    @Put(':user_id/addCard')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ description: `Sets the quantity value of a card in the specified user collection, if the card is not in the collection, it's added` })
    @ApiParam({ name: 'user_id', description: 'ID of the user', required: true })
    addCardToUserCollection(
        @Param('user_id') user_id: string,
        @Req() req,
        @Body() card: UserHasCardDTO,
    ): Promise<Collection> {
        const user = req.user;
        if (user.role === Role.ADMIN || user._id.toString() === user_id)
            return this.collectionService.addCardToUserCollection(user_id, card);
        else
            throw new UnauthorizedException(
                'You can only access your own collection',
            );
    }
}
