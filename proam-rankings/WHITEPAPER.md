# Whitepaper: Data Pipeline Architecture

## How listener-bot and Scooper-Bot Power proam-rankings

---

## Executive Summary

The proam-rankings platform is powered by an automated data pipeline that transforms Discord messages into rich, searchable match data displayed on a public website. This whitepaper explains how three integrated systems work together to collect, process, and display competitive gaming match results in real-time.

**The Challenge**: Competitive gaming communities generate match results and boxscore images across multiple Discord channels, requiring manual collection, processing, and categorization before they can be displayed on a rankings website.

**The Solution**: An automated three-system architecture that captures Discord messages, processes images, extracts match data, and displays results on the proam-rankings website without manual intervention.

**The Value**: Automated data collection eliminates manual work, ensures consistency, and enables real-time rankings updates that keep players and fans engaged with current competitive standings.

---

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    DISCORD ECOSYSTEM                            │
│                                                                 │
│  ┌──────────────┐         ┌──────────────┐                    │
│  │   Source     │         │ Destination  │                     │
│  │  Channels    │────────▶│  Channels    │                     │
│  │ (Various)    │         │ (Monitored)  │                     │
│  └──────────────┘         └──────────────┘                     │
│         │                        │                              │
│         │                        │                              │
│         │                        ▼                              │
│         │              ┌──────────────────┐                    │
│         │              │   listener-bot   │                    │
│         │              │  (Message Relay) │                    │
│         │              └──────────────────┘                    │
│         │                        │                              │
│         └────────────────────────┘                              │
│                        │                                        │
└────────────────────────┼────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PROCESSING LAYER                             │
│                                                                 │
│              ┌──────────────────────────┐                       │
│              │     Scooper-Bot         │                       │
│              │  (Image Processing &    │                       │
│              │   Data Ingestion)       │                       │
│              └──────────────────────────┘                       │
│                        │                                        │
│                        │                                        │
│         ┌──────────────┼──────────────┐                        │
│         │              │              │                         │
│         ▼              ▼              ▼                         │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐                   │
│  │Cloudflare│   │ Supabase │   │  Image   │                   │
│  │   R2     │   │ Database │   │Processing│                   │
│  │ Storage  │   │          │   │          │                   │
│  └──────────┘   └──────────┘   └──────────┘                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                            │
│                                                                 │
│              ┌──────────────────────────┐                        │
│              │    proam-rankings      │                        │
│              │   (Web Application)    │                        │
│              │                        │                        │
│              │  • Rankings            │                        │
│              │  • Team Statistics     │                        │
│              │  • Player Stats        │                        │
│              │  • Match History       │                        │
│              │  • League Standings    │                        │
│              └──────────────────────────┘                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## System Components

### listener-bot: The Message Relay

**Purpose**: listener-bot acts as a bridge between multiple Discord channels, forwarding messages and attachments from source channels to designated destination channels where they can be processed.

**Key Capabilities**:

- **Multi-Channel Support**: Configured to monitor multiple source channels simultaneously
- **Message Forwarding**: Relays text content and image attachments from source to destination channels
- **Metadata Preservation**: Includes source information (user, channel, server) with forwarded messages
- **Bot Filtering**: Automatically ignores messages from other bots to prevent relay loops

**Why It Exists**: Competitive gaming communities often organize discussions across multiple Discord servers and channels. listener-bot centralizes these distributed messages into monitored channels where Scooper-Bot can process them consistently.

**Business Value**: Enables a single processing pipeline to handle match submissions from multiple community sources without requiring users to change their posting behavior.

---

### Scooper-Bot: The Data Processor

**Purpose**: Scooper-Bot monitors designated Discord channels, detects match result images, processes them, and creates structured database records that power the rankings website.

**Key Capabilities**:

- **Image Detection**: Automatically identifies images in Discord messages, including attachments, embeds, and forwarded message content
- **Image Processing**: Converts images to optimized WebP format and standardizes dimensions for consistent display
- **Automatic Categorization**: Can be configured to automatically assign league, season, or tournament context to images from specific channels
- **Team and Score Extraction**: Intelligently extracts team names and scores from message text when formatted correctly
- **Storage Integration**: Uploads processed images to Cloudflare R2 storage for fast, global content delivery
- **Database Management**: Creates and updates records in Supabase database with match metadata
- **Manual Override**: Provides web dashboard and API for manual categorization when automatic processing isn't sufficient

**Why It Exists**: Raw Discord messages with images need to be transformed into structured, searchable data. Scooper-Bot automates this transformation, extracting relevant information and storing it in a format that the website can efficiently query and display.

**Business Value**: Eliminates hours of manual data entry work, ensures consistent data quality, and enables real-time updates to rankings as matches are completed.

---

### proam-rankings: The Public Face

**Purpose**: proam-rankings is a web application that displays competitive gaming rankings, statistics, and match history to players, fans, and community members.

**Key Capabilities**:

- **Global Rankings**: Displays team rankings across all leagues and tournaments
- **Team Profiles**: Shows team statistics, rosters, and match history
- **Player Statistics**: Tracks individual player performance across matches
- **League Standings**: Displays season standings and match schedules
- **Tournament Brackets**: Shows tournament brackets, results, and prize information
- **Match History**: Provides searchable, paginated match records with boxscore images
- **Real-Time Updates**: Automatically reflects new matches as they're processed by Scooper-Bot

**Why It Exists**: Competitive gaming communities need a centralized, public-facing platform to view rankings and statistics. proam-rankings transforms raw match data into an engaging, navigable website experience.

**Business Value**: Provides transparency and engagement for competitive gaming communities, enabling players to track their progress and fans to follow competitive action.

---

## Data Flow Architecture

The journey from a Discord message to a displayed match result on the website follows these stages:

### Stage 1: Message Creation

A user posts a match result image (boxscore screenshot) in a Discord channel. This could be:

- A direct image attachment
- An image embedded in a forwarded message
- An image shared via a link

**What Happens**: The message exists in Discord with image content and optional text describing teams and scores.

---

### Stage 2: Message Relay

listener-bot detects the message in a configured source channel and forwards it to a corresponding destination channel.

**What Happens**:

- listener-bot reads the message content and attachments
- Forwards text content to the destination channel
- Forwards each image attachment URL individually
- Includes metadata about the source (user, channel, server)

**Why This Matters**: Centralizes messages from multiple sources into channels monitored by Scooper-Bot, enabling consistent processing regardless of where users originally post.

---

### Stage 3: Image Detection

Scooper-Bot monitors the destination channel and detects the forwarded message contains images.

**What Happens**:

- Scooper-Bot scans messages in monitored channels
- Identifies images from attachments, embeds, or forwarded message snapshots
- Checks if the channel is configured for automatic categorization
- Adds a "waiting" reaction (⏳) to indicate the message is pending processing

**Why This Matters**: Ensures no match results are missed and provides visual feedback that the system is aware of the submission.

---

### Stage 4: Categorization

Scooper-Bot determines the league, season, or tournament context for the match.

**Automatic Categorization** (for configured channels):

- Channel is pre-configured with league/season/tournament IDs
- Message is automatically categorized with this context
- System waits for team names and scores before processing

**Manual Categorization** (for other channels):

- Admin user replies with categorization command
- Or uses web dashboard to assign league/season/tournament context
- Message remains pending until categorized

**Why This Matters**: Ensures matches are properly associated with the correct competitive context (league season, tournament, etc.) for accurate rankings and statistics.

---

### Stage 5: Team and Score Extraction

Scooper-Bot attempts to extract team names and scores from the message text.

**What Happens**:

- Analyzes message text for patterns like "Team A: 90 - Team B: 89"
- Validates team names against the database
- Extracts numeric scores
- Determines winner based on scores

**Why This Matters**: Enables automatic match processing without manual data entry when teams and scores are provided in the message.

---

### Stage 6: Image Processing

Scooper-Bot downloads, processes, and optimizes the image.

**What Happens**:

- Downloads image from Discord
- Converts to WebP format for efficient storage and delivery
- Resizes to standard dimensions (1920x1080) while maintaining aspect ratio
- Generates unique match ID (UUID) for the image filename

**Why This Matters**: Ensures consistent image quality and format across all matches, optimizing for web display and storage efficiency.

---

### Stage 7: Storage Upload

Processed image is uploaded to Cloudflare R2 storage.

**What Happens**:

- Determines storage folder path based on league/season configuration
- Uploads processed image to R2 bucket
- Receives public URL for the stored image

**Why This Matters**: Provides fast, global content delivery for match images, ensuring quick page load times for users worldwide.

---

### Stage 8: Database Record Creation

Scooper-Bot creates structured database records.

**What Happens**:

- Creates record in `match_submissions` table with:
  - Match ID (UUID)
  - Image URL
  - League/season/tournament context
  - Team names and scores (if extracted)
  - Timestamp
- Creates record in `matches` table with:
  - Match ID
  - Team IDs (resolved from names)
  - Scores and winner
  - Boxscore image URL
- Creates record in `match_contexts` table linking match to league/season/tournament

**Why This Matters**: Transforms unstructured Discord messages into structured, queryable data that the website can efficiently search, filter, and display.

---

### Stage 9: Website Display

proam-rankings queries the database and displays match data.

**What Happens**:

- Website queries Supabase database for matches
- Retrieves match records with team names, scores, dates, and image URLs
- Displays matches in paginated lists, team pages, player pages, and league standings
- Shows boxscore images when users view match details

**Why This Matters**: Provides the public-facing interface where players and fans can view rankings, statistics, and match history.

---

## Integration Architecture

### Discord as the Communication Layer

All three systems use Discord as their communication medium:

- **listener-bot** reads from source channels and writes to destination channels
- **Scooper-Bot** reads from destination channels and reacts to messages
- Users interact with the system by posting messages in Discord

**Why Discord**: Discord is where competitive gaming communities already gather. Using Discord as the input mechanism requires no behavior change from users—they continue posting match results as they always have.

---

### Supabase as the Data Layer

Scooper-Bot and proam-rankings share Supabase as their database:

- **Scooper-Bot** writes match data to Supabase tables
- **proam-rankings** reads match data from Supabase tables
- Both systems use the same database schema, ensuring data consistency

**Key Tables**:

- `match_submissions`: Initial submission records with image URLs
- `matches`: Processed match records with team IDs, scores, and metadata
- `match_contexts`: Links matches to leagues, seasons, and tournaments
- `teams`: Team information and active status
- `leagues_info`, `league_seasons`, `tournaments`: Competitive context data

**Why Supabase**: Provides a managed PostgreSQL database with real-time capabilities, automatic backups, and a robust API that both systems can use reliably.

---

### Cloudflare R2 as the Storage Layer

Scooper-Bot uploads processed images to Cloudflare R2:

- Images are stored in organized folder structures by league/season
- Public URLs enable direct image access from the website
- Global CDN ensures fast image delivery worldwide

**Why Cloudflare R2**: Provides cost-effective object storage with global content delivery, ensuring match images load quickly for users regardless of location.

---

## Key Features and Capabilities

### Automated Workflows

**Auto-Process Channels**: Channels can be pre-configured with league/season/tournament context. Messages posted in these channels are automatically categorized, requiring only team names and scores to be provided in the message text.

**Cron Scheduler**: Runs on a schedule (default: every 5 minutes) to ensure messages sent while the bot was offline are still processed and categorized.

**Team/Score Extraction**: Automatically extracts team names and scores from message text when formatted correctly, enabling fully automatic processing without manual intervention.

---

### Manual Override Options

**Web Dashboard**: Provides a user-friendly interface to view pending messages, assign categorization, and trigger processing manually when automatic processing isn't sufficient.

**REST API**: Enables integration with external admin tools and dashboards for bulk operations and custom workflows.

**Discord Commands**: Admins can reply to messages with categorization commands for quick manual categorization when needed.

---

### Data Validation and Quality

**Team Name Validation**: Verifies team names exist in the database before processing, preventing errors from typos or invalid team names.

**League/Season/Tournament Validation**: Validates all categorization IDs against the database before processing, ensuring data integrity.

**Error Handling**: Failed processing attempts are logged and reported, with reactions and messages providing feedback about success or failure.

---

### Real-Time Updates

**Immediate Processing**: Messages are processed as soon as they're detected in monitored channels, with processing typically completing within seconds.

**Database Consistency**: Uses database upserts to handle duplicate submissions gracefully, ensuring data consistency even if the same match is submitted multiple times.

**Website Refresh**: proam-rankings queries the database directly, so new matches appear on the website as soon as they're processed and stored.

---

## Benefits and Value Proposition

### For Community Administrators

**Eliminates Manual Work**: No more copying images, uploading files, and manually entering match data. The system handles everything automatically.

**Consistency**: Automated processing ensures all matches are stored with consistent formatting and metadata, reducing errors and inconsistencies.

**Scalability**: The system handles any volume of match submissions without requiring additional staff time.

**Visibility**: Web dashboard provides real-time visibility into pending submissions and processing status.

---

### For Players and Teams

**Real-Time Rankings**: Match results appear in rankings immediately after processing, keeping competitive standings current.

**Match History**: Complete, searchable history of all matches with boxscore images for verification and review.

**Statistics**: Automatic calculation of team and player statistics based on match results.

**Transparency**: Public-facing website provides transparent view of competitive standings and match results.

---

### For the Platform

**Data Quality**: Automated extraction and validation ensure high-quality, consistent data in the database.

**User Experience**: Fast page loads and real-time updates create an engaging user experience.

**Cost Efficiency**: Automated processing reduces operational costs compared to manual data entry.

**Growth**: Scalable architecture supports growth in users, matches, and leagues without proportional increases in operational overhead.

---

## Conclusion

The integration of listener-bot, Scooper-Bot, and proam-rankings creates a seamless data pipeline that transforms Discord messages into a rich, public-facing rankings website. This architecture demonstrates how modern automation can eliminate manual work while improving data quality and user experience.

**Key Success Factors**:

- **Automation**: Reduces manual work while ensuring consistency
- **Integration**: Seamless data flow between systems
- **Flexibility**: Supports both automatic and manual processing workflows
- **Scalability**: Handles growth without proportional operational overhead

**Future Potential**: This architecture provides a foundation for additional features such as automated statistics calculation, predictive analytics, and enhanced match verification workflows.

---

## Technical Architecture Summary

While this whitepaper focuses on business value and user benefits, the technical implementation relies on:

- **Discord.js**: Bot framework for Discord integration
- **Supabase**: Managed PostgreSQL database with real-time capabilities
- **Cloudflare R2**: Object storage with global CDN
- **Node.js/TypeScript**: Backend processing logic
- **Astro**: Web framework for the rankings website
- **Cloudflare Pages**: Hosting for the web application

All systems are designed for reliability, scalability, and maintainability, ensuring the platform can grow with the community it serves.

---

*Document Version: 1.0*  
*Last Updated: 2025*
