CREATE TABLE `blog_posts` (
	`id` varchar(100) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`title` varchar(500) NOT NULL,
	`excerpt` text NOT NULL,
	`content` longtext NOT NULL,
	`cover_image` text NOT NULL,
	`category` varchar(100),
	`tags` json NOT NULL,
	`author` json NOT NULL,
	`published_at` varchar(100),
	`date` varchar(100),
	`reading_time_minutes` int,
	`read_time` varchar(100),
	`status` varchar(100) DEFAULT 'Published',
	`is_published` boolean DEFAULT true,
	`meta_title` varchar(500),
	`seo_title` varchar(500),
	`meta_description` text,
	`seo_description` text,
	CONSTRAINT `blog_posts_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_posts_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `booking_orders` (
	`id` varchar(100) NOT NULL,
	`order_number` varchar(100) NOT NULL,
	`created_at` varchar(100) NOT NULL,
	`service_type` varchar(100) NOT NULL,
	`package_id` varchar(100),
	`package_type` varchar(100),
	`package_title` varchar(255) NOT NULL,
	`trek_date` varchar(100) NOT NULL,
	`participants` json NOT NULL,
	`customer` json NOT NULL,
	`pricing` json NOT NULL,
	`payment_status` varchar(100) NOT NULL,
	`payment_method` varchar(100),
	`payment_paid_at` varchar(100),
	`tracking_source` json NOT NULL,
	CONSTRAINT `booking_orders_id` PRIMARY KEY(`id`),
	CONSTRAINT `booking_orders_order_number_unique` UNIQUE(`order_number`)
);
--> statement-breakpoint
CREATE TABLE `etickets` (
	`id` varchar(100) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`price_usd` float NOT NULL,
	`price_idr` float NOT NULL,
	`features` json NOT NULL,
	`requirements` json NOT NULL,
	CONSTRAINT `etickets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `faqs` (
	`id` varchar(100) NOT NULL,
	`question` text NOT NULL,
	`answer` text NOT NULL,
	`category` varchar(100) NOT NULL,
	CONSTRAINT `faqs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `gallery` (
	`id` varchar(100) NOT NULL,
	`title` varchar(255) NOT NULL,
	`image_url` text NOT NULL,
	`category` varchar(100) NOT NULL,
	`date` varchar(100) NOT NULL,
	`location` varchar(255) NOT NULL,
	CONSTRAINT `gallery_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `routes` (
	`id` varchar(100) NOT NULL,
	`name` varchar(255) NOT NULL,
	`subtitle` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`highlights` json NOT NULL,
	`cover_image` text NOT NULL,
	`altitude_map_image` text NOT NULL,
	`difficulty` varchar(100) NOT NULL,
	`best_for` varchar(255) NOT NULL,
	CONSTRAINT `routes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `testimonials` (
	`id` varchar(100) NOT NULL,
	`name` varchar(255) NOT NULL,
	`country` varchar(100) NOT NULL,
	`country_code` varchar(20) NOT NULL,
	`rating` int NOT NULL,
	`date` varchar(100) NOT NULL,
	`package_title` varchar(255) NOT NULL,
	`comment` text NOT NULL,
	`avatar_url` text,
	`is_verified` boolean NOT NULL DEFAULT true,
	`source` varchar(100) NOT NULL,
	CONSTRAINT `testimonials_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transportation_services` (
	`id` varchar(100) NOT NULL,
	`destination` varchar(255) NOT NULL,
	`vehicle_type` varchar(255) NOT NULL,
	`capacity` varchar(100) NOT NULL,
	`price_usd` float NOT NULL,
	`price_idr` float NOT NULL,
	`duration` varchar(100) NOT NULL,
	`description` text NOT NULL,
	`icon_name` varchar(100) NOT NULL,
	CONSTRAINT `transportation_services_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `trekking_packages` (
	`id` varchar(100) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`title` varchar(255) NOT NULL,
	`route` varchar(100) NOT NULL,
	`finish_route` varchar(100),
	`duration_days` int NOT NULL,
	`duration_nights` int NOT NULL,
	`difficulty` varchar(100) NOT NULL,
	`max_altitude` varchar(100) NOT NULL,
	`meeting_point` varchar(255) NOT NULL,
	`price_usd` float NOT NULL,
	`price_idr` float NOT NULL,
	`deposit_percentage` int NOT NULL,
	`is_popular` boolean DEFAULT false,
	`is_featured` boolean DEFAULT false,
	`short_description` text NOT NULL,
	`overview` text NOT NULL,
	`cover_image` text NOT NULL,
	`gallery_images` json NOT NULL,
	`includes` json NOT NULL,
	`excludes` json NOT NULL,
	`things_to_bring` json NOT NULL,
	`pricing_matrix` json,
	`itinerary` json NOT NULL,
	`faq` json NOT NULL,
	`related_package_ids` json,
	`seo_title` varchar(255) NOT NULL,
	`seo_description` text NOT NULL,
	CONSTRAINT `trekking_packages_id` PRIMARY KEY(`id`),
	CONSTRAINT `trekking_packages_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `vouchers` (
	`id` varchar(100) NOT NULL,
	`code` varchar(100) NOT NULL,
	`type` varchar(100),
	`discount_type` varchar(100),
	`value` float,
	`discount_value` float,
	`min_spend_usd` float NOT NULL,
	`max_discount_usd` float,
	`valid_until` varchar(100),
	`expires_at` varchar(100),
	`usage_limit` int,
	`max_usage` int,
	`used_count` int NOT NULL DEFAULT 0,
	`is_active` boolean NOT NULL DEFAULT true,
	CONSTRAINT `vouchers_id` PRIMARY KEY(`id`),
	CONSTRAINT `vouchers_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `website_settings` (
	`id` varchar(50) NOT NULL DEFAULT 'default',
	`company_name` varchar(255) NOT NULL,
	`site_name` varchar(255),
	`tagline` varchar(255) NOT NULL,
	`contact_whatsapp` varchar(100) NOT NULL,
	`contact_phone` varchar(100) NOT NULL,
	`contact_email` varchar(255) NOT NULL,
	`address` text NOT NULL,
	`office_address` text,
	`google_maps_embed` text NOT NULL,
	`facebook_url` varchar(500) NOT NULL,
	`instagram_url` varchar(500) NOT NULL,
	`tripadvisor_url` varchar(500) NOT NULL,
	`youtube_url` varchar(500) NOT NULL,
	`hero_badge_text` varchar(255) NOT NULL,
	`hero_heading` varchar(255) NOT NULL,
	`hero_subheading` text NOT NULL,
	`hero_background_image` text NOT NULL,
	CONSTRAINT `website_settings_id` PRIMARY KEY(`id`)
);
