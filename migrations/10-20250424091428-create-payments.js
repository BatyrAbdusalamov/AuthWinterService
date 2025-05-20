'use strict';
/** @type {import('sequelize-cli').Migration} */
const SQL_QUERY_MIGRATE = `
CREATE TABLE public.payments (
	id serial4 NOT NULL,
	client_id int4 NULL,
	abonement_id int4 NOT NULL,
	"date" timestamp NOT NULL,
	CONSTRAINT payments_pkey PRIMARY KEY (id),
	CONSTRAINT payments_abonement_id_fkey FOREIGN KEY (abonement_id) REFERENCES public.abonements(id),
	CONSTRAINT payments_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id)
);
`

module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.sequelize.query(SQL_QUERY_MIGRATE);
  },
  async down(queryInterface, Sequelize) {
    return await queryInterface.dropTable('payments');
  }
};