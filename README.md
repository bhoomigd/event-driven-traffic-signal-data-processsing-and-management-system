# Event-Driven Traffic Signal Data Processing and Management System

This project is a real-time, event-driven solution designed to process traffic signal data, optimize traffic flow, and manage signal timings based on live data streams. By utilizing an event-driven architecture (EDA), the system ensures low latency and high scalability for urban traffic management.

## 📌 Project Overview

Traditional traffic management systems often rely on fixed timers. This system leverages **Event-Driven Architecture** to react to real-time events—such as vehicle detection, emergency vehicle presence, or congestion levels—to dynamically adjust traffic light states.

### Key Features

* **Real-time Data Ingestion:** Consumes data from IoT sensors, cameras, or simulated traffic nodes.
* **Dynamic Signal Control:** Adjusts green-light durations based on traffic density.
* **Emergency Overrides:** Prioritizes emergency vehicles (ambulances, fire trucks) through event triggers.
* **Scalable Processing:** Uses message brokers to handle high-frequency data from multiple intersections.
* **Data Persistence & Analytics:** Stores traffic patterns for long-term urban planning and reporting.

---

## 🏗 System Architecture

The system follows a decoupled architecture where producers (sensors) send events to a broker, and consumers (processing engines/controllers) act on those events.

1. **Event Producers:** Traffic sensors, induction loops, or GPS data from vehicles.
2. **Message Broker:** (e.g., Apache Kafka or RabbitMQ) Acts as the backbone for event distribution.
3. **Stream Processing Engine:** Analyzes incoming data to calculate the optimal signal phase.
4. **Signal Controllers:** The "Actors" that receive commands to change physical or virtual light states.
5. **Dashboard:** A monitoring UI to visualize current traffic flow and system health.

---

## 🚀 Getting Started

### Prerequisites

* **Java/Python/Node.js** (Depending on the specific implementation language used in the repo)
* **Docker** (Recommended for running message brokers)
* **Apache Kafka** or **RabbitMQ**
* **Database:** (e.g., PostgreSQL, InfluxDB, or MongoDB)

### Installation

1. **Clone the Repository:**
```bash
git clone https://github.com/bhoomigd/event-driven-traffic-signal-data-processsing-and-management-system.git
cd event-driven-traffic-signal-data-processsing-and-management-system

```


2. **Start Infrastructure:**
If using Docker Compose:
```bash
docker-compose up -d

```


3. **Configure Environment:**
Update the `config.properties` or `.env` file with your broker addresses and database credentials.
4. **Run the Application:**
```bash
# Example for a Maven/Java project
mvn clean install
mvn spring-boot:run

```



---

## 🛠 Usage

1. **Simulating Traffic:** Use the provided simulation script in the `/scripts` folder to generate synthetic traffic events.
2. **Monitoring:** Access the web dashboard (usually at `localhost:8080`) to see real-time signal changes.
3. **API Endpoints:**
* `GET /api/v1/status/{intersectionId}`: Get current status of a specific signal.
* `POST /api/v1/emergency`: Manually trigger an emergency override.



---

## 📊 Data Flow

The data flow follows a specific lifecycle:

1. **Detection:** A sensor detects a vehicle.
2. **Publication:** An `Event` object is published to the `traffic-data` topic.
3. **Processing:** The logic engine determines if the current green light should be extended.
4. **Command:** A `Command` event is sent to the `signal-control` topic.
5. **Execution:** The intersection controller updates the signal state.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
# AngularStorybook

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.0.4.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Sample Creds

Username: emilys
Password: emilyspass

Username: michaelw
Password: michaelwpass

Username: sophiab
Password: sophiabpass

Username: jamesd
Password: jamesdpass

Username: emmaj
Password: emmajpass
