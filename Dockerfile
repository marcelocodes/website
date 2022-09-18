FROM node:lts

RUN apt-get update
RUN apt-get install -y curl unzip

# Install and setup Deno.
RUN curl -fsSL https://deno.land/install.sh | sh
RUN echo 'export DENO_INSTALL="${HOME}/.deno"' >> ~/.bashrc
RUN echo 'export PATH="${DENO_INSTALL}/bin:${PATH}"' >> ~/.bashrc

# Enable and update PNPM.
RUN corepack enable
RUN pnpm add -g pnpm