export interface SwaggerDocumentOptions {
  ignoreGlobalPrefix?: boolean;
  standardSchemaConverter?: (
    schema: unknown,
    options: { schemaType: 'input' | 'output' },
  ) => { schema: unknown; components?: Record<string, any> } | undefined;
}
