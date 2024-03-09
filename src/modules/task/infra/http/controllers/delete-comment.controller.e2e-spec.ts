import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { DatabaseModule } from 'src/common/database/database.module';
import { PrismaService } from 'src/common/database/prisma/prisma.service';
import request from 'supertest';
import { AttachmentFactory } from 'test/factories/make-attachment.factory';
import { CommentAttachmentFactory } from 'test/factories/make-comment-attachment.factory';
import { CommentFactory } from 'test/factories/make-comment.factory';
import { TaskFactory } from 'test/factories/make-task.factory';

describe('Delete Comment (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let commentFactory: CommentFactory
  let taskFactory: TaskFactory
  let attachmentFactory: AttachmentFactory
  let commentAttachmentFactory: CommentAttachmentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CommentFactory, TaskFactory, AttachmentFactory, CommentAttachmentFactory]
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    commentFactory = moduleRef.get(CommentFactory)
    taskFactory = moduleRef.get(TaskFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    commentAttachmentFactory = moduleRef.get(CommentAttachmentFactory)

    await app.init();
  });

  test('[DELETE] /comment/:id', async () => {
    const task = await taskFactory.makePrismaTask()
    const attachment1 = await attachmentFactory.makePrismaAttachment()
    const attachment2 = await attachmentFactory.makePrismaAttachment()
    const comment = await commentFactory.makePrismaComment({
      taskId: task.id,
    })
    const commentId = comment.id.toString()

    await commentAttachmentFactory.makePrismaCommentAttachment({
      attachmentId: attachment1.id,
      commentId: comment.id
    })
    await commentAttachmentFactory.makePrismaCommentAttachment({
      attachmentId: attachment2.id,
      commentId: comment.id
    })

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

    const attachmentOnDatabase = await prisma.attachment.findMany({
      where: {
        commentId
      }
    })
    expect(attachmentOnDatabase).toHaveLength(0)
  });

  test('[DELETE] /comments/:id not exists', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/comments/commentid-qualquer`)
      .send();

    expect(response.statusCode).toBe(404);
  });
});
