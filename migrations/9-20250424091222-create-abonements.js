'use strict';
/** @type {import('sequelize-cli').Migration} */
const SQL_QUERY_MIGRATE = `
CREATE TABLE public.abonements (
	id serial4 NOT NULL,
	type_id int4 NOT NULL,
	"name" varchar(400) NOT NULL,
	kind_of_sport_id int4 NOT NULL,
	CONSTRAINT abonements_pkey PRIMARY KEY (id),
	CONSTRAINT abonements_kind_of_sport_id_fkey FOREIGN KEY (kind_of_sport_id) REFERENCES public.kinds_of_sport(id),
	CONSTRAINT abonements_type_id_fkey FOREIGN KEY (type_id) REFERENCES public.abonement_types(id)
);
`

module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.sequelize.query(SQL_QUERY_MIGRATE);
  },
  async down(queryInterface, Sequelize) {
    return await queryInterface.dropTable('abonements');
  }
};