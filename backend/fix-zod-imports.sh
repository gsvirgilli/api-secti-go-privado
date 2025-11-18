#!/bin/bash

echo "=== Corrigindo imports do Zod para v3.x ==="

# Ir para o diretório src
cd src 2>/dev/null || cd backend/src 2>/dev/null || { echo "Diretório src não encontrado"; exit 1; }

# 1. Substituir todos os padrões de import
echo ">>> Corrigindo padrões de import..."

# Padrão: import { z } from 'zod'
find . -name "*.ts" -exec sed -i "s/import { z } from 'zod'/import * as z from 'zod'/g" {} \;
find . -name "*.ts" -exec sed -i 's/import { z } from "zod"/import * as z from "zod"/g' {} \;

# Padrão: import { z, ZodError } from 'zod'
find . -name "*.ts" -exec sed -i "s/import { z, ZodError } from 'zod'/import * as z from 'zod'/g" {} \;
find . -name "*.ts" -exec sed -i 's/import { z, ZodError } from "zod"/import * as z from "zod"/g' {} \;

# Padrão: import { ZodError } from 'zod' (sozinho)
find . -name "*.ts" -exec sed -i "s/import { ZodError } from 'zod'/import * as z from 'zod'/g" {} \;
find . -name "*.ts" -exec sed -i 's/import { ZodError } from "zod"/import * as z from "zod"/g' {} \;

# Padrão: import { z, ZodObject, ZodRawShape } from 'zod'
find . -name "*.ts" -exec sed -i "s/import { z, ZodObject, ZodRawShape } from 'zod'/import * as z from 'zod'/g" {} \;

# Padrão: import { ZodObject, ZodRawShape } from 'zod'
find . -name "*.ts" -exec sed -i "s/import { ZodObject, ZodRawShape } from 'zod'/import * as z from 'zod'/g" {} \;

# Qualquer outro import com z
find . -name "*.ts" -exec sed -i "s/import { z[^}]* } from 'zod'/import * as z from 'zod'/g" {} \;

# 2. Corrigir uso de ZodError (precisa ser z.ZodError)
echo ">>> Corrigindo uso de ZodError..."
find . -name "*.ts" -exec sed -i 's/instanceof ZodError/instanceof z.ZodError/g' {} \;
find . -name "*.ts" -exec sed -i 's/error instanceof z\.z\.ZodError/error instanceof z.ZodError/g' {} \;

# 3. Corrigir ZodSchema
find . -name "*.ts" -exec sed -i 's/z\.ZodSchema/z.ZodType/g' {} \;

echo ">>> Correções aplicadas!"
echo ""
echo "Agora faça:"
echo "  1. git add ."
echo "  2. git commit -m 'fix: zod imports for v3.x'"
echo "  3. git push"
echo ""
echo "E limpe o cache no Render antes de rebuildar."
