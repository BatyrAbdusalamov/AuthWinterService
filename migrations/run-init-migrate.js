const Sequelize = require("sequelize");
const sequelize = new Sequelize("auth_service_db", "postgres", "postgres", {
  dialect: "postgres",
  host: "database"
});
const migration1 = require('./1-20250326085500-create-roles');
const migration2 = require('./2-20250424091135-create-kinds-of-sport');
const migration3 = require('./3-20250424091015-create-abonement-types');
const migration4 = require('./4-20250424091148-create-place');
const migration5 = require('./5-20250325130255-create-clients');
const migration6 = require('./6-20250424091234-create-couches');
const migration7 = require('./7-20250424091252-create-groups');
const migration8 = require('./8-20250424091314-create-clients-groups');
const migration9 = require('./9-20250424091222-create-abonements');
const migration10 = require('./10-20250424091428-create-payments');
const migration11 = require('./11-20250424091337-create-classes');
const migration12 = require('./12-20250424091111-create-equipment');
const migration13 = require('./13-20250424091359-create-equipment-classes');
const migration14 = require('./14-20250424091415-create-feedbacks');
const migration15 = require('./15-20250424091415-create-coaches-salary');

const runMigrations = async () => {
  await sequelize.authenticate();
  const queryInterface = sequelize.getQueryInterface();
  await sequelize.getQueryInterface().sequelize.transaction(async (transaction) => {
    await migration1.up(queryInterface, { transaction } );
    await migration2.up(queryInterface, { transaction } );
    await migration3.up(queryInterface, { transaction } );
    await migration4.up(queryInterface, { transaction } );
    await migration5.up(queryInterface, { transaction } );
    await migration15.up(queryInterface, { transaction } );
    await migration6.up(queryInterface, { transaction } );
    await migration7.up(queryInterface, { transaction } );
    await migration8.up(queryInterface, { transaction } );
    await migration9.up(queryInterface, { transaction } );
    await migration10.up(queryInterface, { transaction } );
    await migration11.up(queryInterface, { transaction } );
    await migration12.up(queryInterface, { transaction } );
    await migration13.up(queryInterface, { transaction } );
    await migration14.up(queryInterface, { transaction } );
  });

  console.log('Migrations executed successfully');
};

runMigrations().catch((error) => {
  console.error('Error running migrations:', error);
});
