const fs = require('fs');
const path = require('path');
const sequelize = require('../sequelize');
const User = require('../models/userModel');
const Invoice = require('../models/invoiceModel');
const { faker } = require('@faker-js/faker');

const seedFromUsuariosJson = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conectado a la base de datos');

    const fresh = process.argv.includes('--fresh');

    if (fresh) {
      console.log('Eliminando y recreando tablas...');
      await sequelize.sync({ force: true });
    } else {
      console.log('Borrando datos sin eliminar tablas...');
      await Invoice.destroy({ where: {}, truncate: true });
      await User.destroy({ where: {}, truncate: true });
    }

    // 1. Cargar usuarios desde JSON
    const usuariosPath = path.join(__dirname, '../../../data/usuarios.json');
    const usuariosData = JSON.parse(fs.readFileSync(usuariosPath, 'utf-8'));
    const usuariosReducidos = usuariosData.map(u => ({ id: u.id, email: u.email }));

    await User.bulkCreate(usuariosReducidos, { ignoreDuplicates: true });
    console.log(`Usuarios replicados: ${usuariosReducidos.length}`);

    // 2. Generar facturas aleatorias
    const estados = ['Pendiente', 'Pagado', 'Vencido'];
    const facturas = [];

    for (let i = 0; i < 300; i++) {
      const usuario = faker.helpers.arrayElement(usuariosReducidos);
      facturas.push({
        userId: usuario.id,
        monto: faker.number.int({ min: 10000, max: 100000 }),
        estado: faker.helpers.arrayElement(estados),
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent()
      });
    }

    await Invoice.bulkCreate(facturas);
    console.log(`Facturas generadas: ${facturas.length}`);

  } catch (err) {
    console.error('Error al ejecutar seeder:', err.message);
  } finally {
    await sequelize.close();
    console.log('Conexión cerrada');
  }
};

seedFromUsuariosJson();
