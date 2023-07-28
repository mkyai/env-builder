# Build-env-action

Create .env from secrets & variable.

## Usage

By using this action `mkyai/env-builder@v1`, you can create .env file from secrets & variable stored in GitHub.

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Create Environment
        uses: mkyai/env-builder@v1.0.1
        with:
          secrets: ${{ toJson(secrets) }}
          variables: ${{ toJson(vars) }}
          extra: #Optional extra variables
          path: #Path to extra env file
```

## License

MIT
