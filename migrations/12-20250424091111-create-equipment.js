'use strict';
/** @type {import('sequelize-cli').Migration} */
const SQL_QUERY_MIGRATE = `
CREATE TABLE public.equipment (
	id serial4 NOT NULL,
	"name" varchar(400) NOT NULL,
	"size" varchar(400) NOT NULL,
	count int4 NULL,
	CONSTRAINT equipment_pkey PRIMARY KEY (id)
);

`

module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.sequelize.query(SQL_QUERY_MIGRATE);
  },
  async down(queryInterface, Sequelize) {
    return await queryInterface.dropTable('equipment');
  }
};