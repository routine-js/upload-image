Helps you with the process of choosing an image to upload

[docs](https://lulusir.github.io/mvp/ecosystem/upload-image)


```typescript
  const { presenter, state } = usePresenter<UploadImagePresenter>(
    UploadImagePresenter,
    {
      autoUpdate: true,
      registry: [
        { token: UploadServiceToken, useClass: MyUploadService },
        {
          token: SelectImageServiceToken,
          useClass: SelectImageService,
        },
      ],
    },
  );
```
