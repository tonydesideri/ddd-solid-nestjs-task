import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/infra/app.module';
import { DatabaseModule } from 'src/infra/database/database.module';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import request from 'supertest';
import { CommentFactory } from 'test/factories/make-comment.factory';

describe('Delete Comment (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let commentFactory: CommentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CommentFactory]
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    commentFactory = moduleRef.get(CommentFactory)

    await app.init();
  });

  test('[DELETE] /comment/:id', async () => {
    const comment = await commentFactory.makePrismaComment()
    const commentId = comment.id.toString()

    const response = await request(app.getHttpServer())
      .delete(`/comments/${commentId}`)
      .send();

    expect(response.statusCode).toBe(204);

    const commentOnDatabase = await prisma.comment.findUnique({
      where: {
        id: commentId
      },
    });

    expect(commentOnDatabase).toBeNull();
  });

  test('[DELETE] /comments/:id not exists', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/comments/commentid-qualquer`)
      .send();

    expect(response.statusCode).toBe(404);
  });
});
