FROM node:lts-alpine as builder
WORKDIR /sf-nest-admin

# set timezone
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
RUN echo 'Asia/Shanghai' > /etc/timezone

# RUN npm set registry https://registry.npm.taobao.org
# cache step
COPY package.json /sf-nest-admin/package.json
RUN yarn install
# build
COPY ./ /sf-nest-admin
RUN yarn build
# clean dev dep
RUN rm -rf node_modules
RUN yarn install --production

# httpserver set port
EXPOSE 7001
# websokcet set port
EXPOSE 7002

CMD ["yarn", "start:prod"]
