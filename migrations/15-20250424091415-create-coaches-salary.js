'use strict';
/** @type {import('sequelize-cli').Migration} */
const SQL_QUERY_MIGRATE = `
CREATE TABLE public.coaches_salary (
	id serial4 NOT NULL,
	"rank" varchar(100) NULL,
	class_cost int4 NULL,
	CONSTRAINT coaches_salary_pkey PRIMARY KEY (id)
);
`

module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.sequelize.query(SQL_QUERY_MIGRATE);
  },
  async down(queryInterface, Sequelize) {
    return await queryInterface.dropTable('coaches_salary');
  }
};