// Setup .env file for frontend
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '.env');
const envContent = 'VITE_API_URL=http://localhost:4000/api\n';

fs.writeFileSync(envPath, envContent, 'utf8');

console.log('✓ تم إنشاء/تحديث ملف .env');
console.log('');
console.log('المحتوى:');
console.log(envContent);
console.log('');
console.log('⚠️  مهم: أعد تشغيل Frontend (npm run dev) حتى تعمل التغييرات');

