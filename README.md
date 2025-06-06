# 📦 InventarioApp

Sistema web para la gestión de inventario de un comercio, desarrollado con **Java + Spring Boot** en el backend y **React + Tailwind CSS** en el frontend. Soporta diferentes funcionalidades de administración de productos, ventas, clientes, proveedores y usuarios, con control de acceso según el rol.

---

## 🚀 Funcionalidades Principales

- 📋 **CRUD de Productos**
- 🧾 **CRUD de Ventas**
- 🧍‍♂️ **CRUD de Clientes**
- 🚚 **CRUD de Proveedores**
- 👤 **CRUD de Usuarios** (solo para administradores)
- 📊 **Visualización de Ventas Realizadas** (solo para administradores)

---

## 🔐 Roles

- **Administrador**
  - Acceso completo a todas las funciones: usuarios, productos, ventas, clientes y proveedores.
  
- **Operador**
  - Acceso a productos, ventas, clientes y proveedores.
  - **No** puede acceder al módulo de usuarios ni al historial de ventas realizadas.

---

## 🛠️ Tecnologías Usadas

### Backend (`InventarioApp`)
- Java 17+
- Spring Boot
- Maven
- Base de datos (MySQL)

### Frontend (`front-inventario`)
- React
- JavaScript (ES6+)
- Tailwind CSS

---

## 📁 Estructura del Proyecto

inventario-project/
│
├── InventarioApp/ # Backend (Java + Spring Boot)
│ └── src/...
│
└── front-inventario/ # Frontend (React + Tailwind)
└── src/...


---

## ⚙️ Instalación y Ejecución

### 🔧 Backend

```bash
cd InventarioApp
mvn spring-boot:run
```
### 🎨 Frontend

```bash
cd front-inventario
npm install
npm run start
```
