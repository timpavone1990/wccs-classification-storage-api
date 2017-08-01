FROM node:onbuild
LABEL maintainer="Tim Gremplewski <tim.gremplewski@gmail.com>"

RUN wget https://github.com/Yelp/dumb-init/releases/download/v1.2.0/dumb-init_1.2.0_amd64.deb \
    && dpkg --install dumb-init_*.deb \
    && rm dumb-init_*.deb

EXPOSE 52629

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["npm", "start"]
