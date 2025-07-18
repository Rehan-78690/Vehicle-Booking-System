-- CreateTable
CREATE TABLE "vehicles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT,
    "passenger_capacity" INTEGER NOT NULL,
    "suitcase_capacity" INTEGER NOT NULL,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pricing" (
    "id" SERIAL NOT NULL,
    "vehicle_type" VARCHAR(50) NOT NULL,
    "destination_category" VARCHAR(20),
    "rate_per_km" DOUBLE PRECISION,
    "rate_per_hour" DOUBLE PRECISION,
    "rate_per_day" DOUBLE PRECISION,
    "condition" VARCHAR(50),
    "adjustment" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pricing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quote" (
    "id" SERIAL NOT NULL,
    "useCase" TEXT NOT NULL,
    "formData" JSONB NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "vehicleType" TEXT NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,
    "hours" INTEGER,
    "bookingDays" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pricing_vehicle_type_destination_category_key" ON "pricing"("vehicle_type", "destination_category");
