import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';
import { PassportStrategy } from '@nestjs/passport';
async function bootstrap() {
  const serverConfig = config.get('server'); // as we are in development env. config package tries to get development.yml file, if server (key) does not exists in it it tries default.yml
  const logger = new Logger('bootstrap'); // to user logging, just create a variable and user it
  const app = await NestFactory.create(AppModule);
  if(process.env.NODE_ENV==='development'){
    app.enableCors(); // accept request from different origin (origin refers to server address and port as port in ui is 3001 and for nest is 3000. We want to set it only for development env. NODE_ENV=development is set in start:dev script)
  }else{
    app.enableCors({ origin: serverConfig.origin }) // in production, enable access only to our front-end in s3 bucket (could be an array of origins)
    logger.log(`Accepting requests from origin $${serverConfig.origin}`);
  }
  const port =  process.env.PORT || serverConfig.port; // it tries env port (we can set it when we run ... I have to check it in yarn it's like PORT=3005 yarn start )
  await app.listen(port);
  logger.log(`application is running on port ${port}`);
}
bootstrap();
