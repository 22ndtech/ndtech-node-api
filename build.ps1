docker build `
  -f .\Dockerfile `
  -t 22ndtech/ndtech-node-api:0.0.1 `
  --build-arg GITHUB_USER=$ENV:GITHUB_USER `
  --build-arg GITHUB_TOKEN=$ENV:GITHUB_TOKEN `
  --build-arg GITHUB_ORGANIZATION="22ndtech" `
  --build-arg GIT_USER_NAME="$ENV:GIT_USER_NAME" `
  --build-arg GIT_USER_EMAIL="$ENV:GIT_USER_EMAIL" `
  --build-arg GIT_REPOSITORY_NAME="ndtech" `
  --build-arg REPOSITORY_URL="https://${ENV:GITHUB_USER}:${ENV:GITHUB_TOKEN}@github.com/${ENV:GITHUB_ORGANIZATION}/${ENV:GIT_REPOSITORY_NAME}.git" `
  .

  
