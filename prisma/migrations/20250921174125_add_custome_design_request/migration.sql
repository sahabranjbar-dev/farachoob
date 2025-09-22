-- CreateTable
CREATE TABLE "public"."CustomDesignRequest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "productType" TEXT NOT NULL,
    "dimensions" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomDesignRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CustomDesignRequestImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "requestId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomDesignRequestImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."CustomDesignRequestImage" ADD CONSTRAINT "CustomDesignRequestImage_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "public"."CustomDesignRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
