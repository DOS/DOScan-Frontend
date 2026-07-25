<h1 align="center">Blockscout frontend</h1>

<p align="center">
    <span>Frontend application for </span>
    <a href="https://github.com/blockscout/blockscout/blob/master/README.md">Blockscout</a>
    <span> blockchain explorer</span>
</p>

## Running and configuring the app

App is distributed as a docker image. Here you can find information about the [package](https://github.com/blockscout/frontend/pkgs/container/frontend) and its recent [releases](https://github.com/blockscout/frontend/releases).

You can configure your app by passing necessary environment variables when starting the container. See full list of ENVs and their description [here](./docs/ENVS.md).

```sh
docker run -p 3000:3000 --env-file <path-to-your-env-file> ghcr.io/blockscout/frontend:latest
```

Alternatively, you can build your own docker image and run your app from that. Please follow this [guide](./docs/CUSTOM_BUILD.md).

For more information on migrating from the previous frontend, please see the [frontend migration docs](https://docs.blockscout.com/setup/deployment/frontend-migration).

### Custom footer version links

This image supports runtime configuration of the repository links behind the backend and frontend version labels in the footer:

```sh
NEXT_PUBLIC_BACKEND_REPO_URL=https://github.com/my-org/blockscout
NEXT_PUBLIC_FRONTEND_REPO_URL=https://github.com/my-org/blockscout-frontend
NEXT_PUBLIC_VERSION_LINK_TYPE=release
```

The defaults remain the upstream Blockscout repositories with `tree` links. Set `NEXT_PUBLIC_VERSION_LINK_TYPE=release` when your fork publishes matching GitHub releases. See the [footer environment variables](https://github.com/DOS/DOScan-Frontend/blob/main/docs/ENVS.md#footer) for details.

## Contributing

See our [Contribution guide](./docs/CONTRIBUTING.md) for pull request protocol. We expect contributors to follow our [code of conduct](./CODE_OF_CONDUCT.md) when submitting code or comments.

## Resources
- [App ENVs list](./docs/ENVS.md)
- [Contribution guide](./docs/CONTRIBUTING.md)
- [Making a custom build](./docs/CUSTOM_BUILD.md)
- [Frontend migration guide](https://docs.blockscout.com/setup/deployment/frontend-migration)
- [Manual deployment guide with backend and microservices](https://docs.blockscout.com/setup/deployment/manual-deployment-guide)

## License

[![License: Blockscout Software Licence](https://img.shields.io/badge/License-Blockscout%20Software%20Licence-blue.svg)](LICENSE)

This project is licensed under the Blockscout Software Licence. See the [LICENSE](LICENSE) file for full terms.

Third-party components included in this repository remain subject to their own licenses. See dependency manifests and bundled third-party notices for component-level license terms.
