// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
    provider = "prisma-client-js"
  }
  
  datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
  }
  
  model User {
    id                              String            @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
    email                           String            @unique
    firstName                       String?     
    lastName                        String?     
    createdAt                       DateTime          @default(now())
    updatedAt                       DateTime?         @default(now())
    clerkId                         String            @unique
    studio                          Media?
    image                           String?
    workspace                       WorkSpace[]
    videos                          Video[]
    subscription                    Subscription[]
    members                         Member[]
    notification                    Notification[]
    sender                          Invite[]          @relation("sender")
    receiver                        Invite[]          @relation("receiver")
    trial                           Boolean           @default(false)
  }
  
  model Subscription{
    id                              String              @id @default(dbgenerated("gen-random-uuid()")) @db.Uuid
    User                            User                @relation(fields: [userId], references: [id])
    userId                          String              @unique @db.Uuid
    createdAt                       DateTime            @default(now())
    updatedAt                       DateTime            @default(now())
    plan                            SUBSCRIPTION_PLAN   @default(FREE)
    customerId                      String              @unique
  }
  
  model Media {
    id                              String              @id @default(dbgenerated("gen_random_uuid")) @db.Uuid
    screen                          String?
    mic                             String?
    camera                          String?
    preset                          PRESET              @default(SD)
    user                            User                @relation(fields: [userId], references: [id])
    userId                          String              @unique @db.Uuid
  } 
  
  model WorkSpace {
    id                              String              @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
    type                            Type
    name                            String
    User                            User                @relation(fields: [userId], references: [id])
    userId                          String              @db.Uuid
    createdAt                       DateTime            @default(now())
    folders                         Folder[]
    videos                          Video[]
    members                         Member[]
    invite                          Invite[]
  }
  
  model Folder{
    id                              String            @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
    name                            String            @default("Untitled Folder")
    createdAt                       DateTime          @default(now())
    workSpace                       WorkSpace         @relation(fields: [workSpaceId], references: [id])
    workSpaceId                     String            @db.Uuid
    videos                          Video[]
  }
  
  model Video {
    id                              String            @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
    title                           String            @default("Untitled Video")
    description                     String            @default("Untitled Description")
    source                          String            @unique
    createdAt                       DateTime          @default(now())
    folder                          Folder            @relation(fields: [folderId], references: [id])
    folderId                        String            @db.Uuid
    user                            User              @relation(fields: [userId], references: [id])
    userId                          String            @db.Uuid
    processing                      Boolean           @default(true)
    workSpace                       WorkSpace         @relation(fields: [workSpaceId], references: [id])
    workSpaceId                     String            @db.Uuid
    views                           Int               @default(0)
    summery                         String?
  }
  
  model Member {    
    id                              String            @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
    user                            User              @relation(fields: [userId], references: [id])
    userId                          String            @db.Uuid
    createdAt                       DateTime          @default(now())
    member                          Boolean           @default(true)
    workSpace                       WorkSpace         @relation(fields: [workSpaceId], references: [id])
    workSpaceId                     String            @db.Uuid  
  }
  
  model Notification {
    id                              String            @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
    user                            User              @relation(fields: [userId], references: [id])
    userId                          String            @db.Uuid
    content                         String
  }
  
  model Invite {
    id                              String            @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
    sender                          User              @relation("sender", fields: [senderId], references: [id])
    senderId                        String            @db.Uuid
    receiver                        User              @relation("receiver", fields: [receiverId], references: [id])
    receiverId                      String            @db.Uuid
    content                         String      
    workSpace                       WorkSpace         @relation(fields: [workSpaceId], references: [id])
    workSpaceId                     String            @db.Uuid
    accepted                        Boolean           @default(false)
  }
  
  enum Type {
    PERSONAL
    PUBLIC
  }
  
  enum PRESET { 
    HD
    SD 
  }
  
  enum SUBSCRIPTION_PLAN {
    PRO
    FREE
  }