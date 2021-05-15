FROM node:lts-alpine as builder
WORKDIR /sf-nest-admin

# install pm2
RUN npm install pm2 -g

# set timezone
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
RUN echo 'Asia/Shanghai' > /etc/timezone

# RUN npm set registry https://registry.npm.taobao.org
# cache step
COPY package.json /sf-nest-admin/package.json
RUN npm install
# build
COPY ./ /sf-nest-admin
RUN npm run build
# clean dev dep
RUN rm -rf node_modules && rm package-lock.json
RUN npm install --production

ENV NODE_ENV production

# bootstrap set port
EXPOSE 7001

CMD ["npm", "run", "start:prod"]
