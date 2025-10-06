import { testSequelize, setupTestDatabase, teardownTestDatabase } from '../../src/config/database.test.config.js';
import UserTest from '../../src/modules/users/user.test.model.js';
import CourseTest from '../../src/modules/courses/course.test.model.js';
import bcrypt from 'bcryptjs';
import { signJwt } from '../../src/utils/jwt.js';

export class TestHelper {
  static async setupDatabase() {
    await setupTestDatabase();
    await testSequelize.sync({ force: true });
  }

  static async teardownDatabase() {
    await teardownTestDatabase();
  }

  static async createTestUser(userData?: Partial<any>) {
    const defaultData = {
      nome: 'Test User',
      email: 'test@example.com',
      senha_hash: await bcrypt.hash('password123', 8),
      role: 'ADMIN'
    };

    const user = await UserTest.create({
      ...defaultData,
      ...userData
    });

    const token = signJwt({ sub: String(user.id), role: user.role });

    return { user, token };
  }

  static async createTestCourse(courseData?: Partial<any>) {
    const defaultData = {
      nome: 'Test Course',
      carga_horaria: 40,
      descricao: 'Test course description'
    };

    return await CourseTest.create({
      ...defaultData,
      ...courseData
    });
  }

  static async clearDatabase() {
    await CourseTest.destroy({ where: {} });
    await UserTest.destroy({ where: {} });
  }
}

export { UserTest, CourseTest };