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

/** Options used when reading text or JSON files. */
export type ReadTextFileOptions = FileOptions & {
  /** Text encoding passed to the filesystem API. */
  encoding?: BufferEncoding;
};
