type FileOptions = {
  /** Relative or absolute target path */
  filePath: string;
  /** Base directory override (defaults to the caller's `.dump` directory) */
  baseDir?: string;
};

export type CreateTextFileOptions = FileOptions & {
  /** Content to write */
  content: string;
  /** Whether to overwrite existing files (defaults to `true`) */
  overwrite?: boolean;
};

export type ReadTextFileOptions = FileOptions & {
  encoding?: BufferEncoding;
};
