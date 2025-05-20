'use strict';
/** @type {import('sequelize-cli').Migration} */
const SQL_QUERY_MIGRATE = `
CREATE TABLE public.promo (
	id serial4 NOT NULL,
	"name" varchar(400) NULL,
	created timestamp NULL,
	description varchar(1500000) NULL,
	image varchar(300000) NULL,
	CONSTRAINT promo_pkey PRIMARY KEY (id)
);
`

module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.sequelize.query(SQL_QUERY_MIGRATE);
  },
  async down(queryInterface, Sequelize) {
    return await queryInterface.dropTable('promo');
  }
};