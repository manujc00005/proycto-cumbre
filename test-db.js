import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const sql = neon(process.env.DATABASE_URL);

async function testConnection() {
  try {
    console.log('🔄 Conectando a Neon...');
    
    // Crear tabla de prueba
    await sql`
      CREATE TABLE IF NOT EXISTS test_posts (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log('✅ Tabla creada correctamente');
    
    // Insertar datos de prueba
    const insertResult = await sql`
      INSERT INTO test_posts (title, content) 
      VALUES ('Post de prueba', 'Este es un contenido de prueba')
      RETURNING *
    `;
    console.log('✅ Datos insertados:', insertResult);
    
    // Leer datos
    const posts = await sql`SELECT * FROM test_posts`;
    console.log('✅ Datos leídos:', posts);
    
    console.log('🎉 ¡Conexión exitosa!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testConnection();