terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = ">= 4.34.0"
    }
  }
}

provider "google" {
  project = "goodday-exercise"
  region = "us-central1"
}

resource "google_pubsub_topic" "default" {
  name = "purchase-orders-topic"
}

resource "google_pubsub_subscription" "default" {
  name  = "purchase-orders-subscription"
  topic = google_pubsub_topic.default.name

  # 20 minutes
  message_retention_duration = "1200s"
  retain_acked_messages      = true

  ack_deadline_seconds = 20

  expiration_policy {
    ttl = "300000.5s"
  }
  retry_policy {
    minimum_backoff = "10s"
  }

  enable_message_ordering    = false
}
