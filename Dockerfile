FROM node:lts

RUN apt-get update
RUN apt-get install -y curl unzip
RUN curl -fsSL https://deno.land/install.sh | sh
RUN echo 'export DENO_INSTALL="${HOME}/.deno"' >> ~/.bashrc
RUN echo 'export PATH="${DENO_INSTALL}/bin:${PATH}"' >> ~/.bashrc
RUN corepack enable