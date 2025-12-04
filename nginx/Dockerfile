FROM public.ecr.aws/docker/library/nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
