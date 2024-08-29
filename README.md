<div align="center">
    <h1 align="center">One Piece TCG API</h1>
    <a href="#" target="blank">
        <img src="https://static.wixstatic.com/media/57a197_e334385962ac4203abe6390f3b6ff4c6~mv2.png/v1/fill/w_683,h_384,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/ONE%20PIECE%20LOGO.png" width="300" alt="OnePiece Logo" />
    </a>
    
</div>

  <p align="center">One Piece trading card game (TCG) REST API built with <a href="http://nestjs.com/" target="_blank">Nest.js</a> framework.</p>

## Description

[Nest](https://github.com/nestjs/nest) TypeScript repository [Mongo](https://github.com/mongodb/mongo) database JWT authentication, and [Swagger](https://github.com/swagger-api/swagger-ui) ([NestJS Swagger](https://github.com/nestjs/swagger)) documentation.

## Project setup

To use this project for your own card database, we suggest using a card scraper or entering the cards manually.<br>At the time of development, we used [this](https://github.com/seitrox/optcg-sim2cardmarket-converter) card scraper from [Seitrox](https://github.com/seitrox).

```bash
$ npm install
# place a JSON with the scrapped cards in /src/scripts/importCards
$ npm run import:cards
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e
```

## Resources

Once the project is already setted up and running, you can check the Swagger documentation in the root (/) route of the project

## Credit

Authors

-   Iker Gonzalez Tirado [LinkedIn](https://www.linkedin.com/in/iker-gonz%C3%A1lez-tirado/), [GitHub](https://github.com/LinkerG)
-

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
