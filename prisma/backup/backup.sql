--
-- PostgreSQL database dump
--

\restrict uanfZN4faiOJpCdFmecz7sM4BDEYIic5NDS2VafHmqbsUCcc71TFv6epVliTNTx

-- Dumped from database version 17.7 (178558d)
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- Name: EventStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."EventStatus" AS ENUM (
    'draft',
    'published',
    'sold_out',
    'cancelled',
    'completed'
);


--
-- Name: FedmeStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."FedmeStatus" AS ENUM (
    'none',
    'pending',
    'processing',
    'active',
    'rejected',
    'expired'
);


--
-- Name: LicenseType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."LicenseType" AS ENUM (
    'none',
    'a',
    'a_plus',
    'a_nac',
    'a_nac_plus',
    'b',
    'b_plus',
    'c'
);


--
-- Name: MembershipStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."MembershipStatus" AS ENUM (
    'pending',
    'active',
    'expired',
    'failed',
    'cancelled'
);


--
-- Name: OrderStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."OrderStatus" AS ENUM (
    'pending',
    'paid',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
    'refunded'
);


--
-- Name: PaymentStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."PaymentStatus" AS ENUM (
    'pending',
    'completed',
    'failed',
    'refunded'
);


--
-- Name: PaymentType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."PaymentType" AS ENUM (
    'membership',
    'event',
    'order',
    'license_renewal'
);


--
-- Name: Sex; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."Sex" AS ENUM (
    'M',
    'F',
    'O'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


--
-- Name: event_registrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.event_registrations (
    id uuid NOT NULL,
    event_id uuid NOT NULL,
    member_id uuid,
    participant_name character varying(255) NOT NULL,
    participant_email character varying(255) NOT NULL,
    participant_phone character varying(20) NOT NULL,
    custom_data jsonb,
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    privacy_accepted boolean DEFAULT false NOT NULL,
    privacy_accepted_at timestamp(3) without time zone,
    privacy_policy_version character varying(20) DEFAULT '1.0'::character varying,
    whatsapp_consent boolean DEFAULT false NOT NULL,
    whatsapp_consent_at timestamp(3) without time zone,
    marketing_consent boolean DEFAULT false NOT NULL,
    marketing_consent_at timestamp(3) without time zone,
    marketing_revoked_at timestamp(3) without time zone,
    registered_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.events (
    id uuid NOT NULL,
    slug character varying(100) NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    event_date timestamp(3) without time zone NOT NULL,
    location character varying(255),
    max_participants integer,
    current_participants integer DEFAULT 0 NOT NULL,
    price integer NOT NULL,
    currency character varying(3) DEFAULT 'eur'::character varying NOT NULL,
    requires_member boolean DEFAULT false NOT NULL,
    member_discount integer DEFAULT 0 NOT NULL,
    custom_fields jsonb,
    whatsapp_group character varying(500),
    status public."EventStatus" DEFAULT 'draft'::public."EventStatus" NOT NULL,
    image_url character varying(500),
    meta_description text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: headquarters; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.headquarters (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    code character varying(20) NOT NULL,
    city character varying(100) NOT NULL,
    phone character varying(20),
    email character varying(255),
    membership_prices jsonb NOT NULL,
    status character varying(20) DEFAULT 'active'::character varying NOT NULL,
    created_at timestamp(3) without time zone DEFAULT now() NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT now() NOT NULL
);


--
-- Name: members; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.members (
    id uuid NOT NULL,
    headquarters_id uuid,
    member_number character varying(50),
    email character varying(255) NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    birth_date date NOT NULL,
    dni character varying(20),
    sex public."Sex" NOT NULL,
    phone character varying(20) NOT NULL,
    emergency_phone character varying(20),
    emergency_contact_name character varying(255),
    province character varying(100) NOT NULL,
    city character varying(100),
    address text NOT NULL,
    postal_code character varying(10),
    shirt_size character varying(10),
    hoodie_size character varying(10),
    pants_size character varying(10),
    license_type public."LicenseType" NOT NULL,
    fedme_license_number character varying(50),
    fedme_status public."FedmeStatus" DEFAULT 'pending'::public."FedmeStatus" NOT NULL,
    membership_status public."MembershipStatus" DEFAULT 'pending'::public."MembershipStatus" NOT NULL,
    membership_start_date date,
    membership_end_date date,
    privacy_accepted boolean DEFAULT true NOT NULL,
    privacy_accepted_at timestamp(3) without time zone,
    privacy_accepted_ip character varying(45),
    privacy_policy_version character varying(20) DEFAULT '1.0'::character varying,
    marketing_consent boolean DEFAULT true NOT NULL,
    marketing_consent_at timestamp(3) without time zone,
    marketing_revoked_at timestamp(3) without time zone,
    whatsapp_consent boolean DEFAULT true NOT NULL,
    whatsapp_consent_at timestamp(3) without time zone,
    whatsapp_revoked_at timestamp(3) without time zone,
    deleted_at timestamp(3) without time zone,
    admin_notes text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_items (
    id uuid NOT NULL,
    order_id uuid NOT NULL,
    product_id uuid,
    product_name character varying(255) NOT NULL,
    product_slug character varying(100),
    variant_data jsonb,
    quantity integer NOT NULL,
    unit_price integer NOT NULL,
    total_price integer NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders (
    id uuid NOT NULL,
    order_number character varying(50) NOT NULL,
    member_id uuid,
    customer_email character varying(255) NOT NULL,
    customer_name character varying(255) NOT NULL,
    customer_phone character varying(20),
    shipping_address jsonb NOT NULL,
    subtotal integer NOT NULL,
    shipping_cost integer DEFAULT 0 NOT NULL,
    tax integer DEFAULT 0 NOT NULL,
    discount integer DEFAULT 0 NOT NULL,
    total integer NOT NULL,
    currency character varying(3) DEFAULT 'eur'::character varying NOT NULL,
    status public."OrderStatus" DEFAULT 'pending'::public."OrderStatus" NOT NULL,
    tracking_number character varying(255),
    shipped_at timestamp(3) without time zone,
    delivered_at timestamp(3) without time zone,
    customer_notes text,
    admin_notes text,
    privacy_policy_version character varying(20) DEFAULT '1.0'::character varying,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: payments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payments (
    id uuid NOT NULL,
    payment_type public."PaymentType" NOT NULL,
    member_id uuid,
    event_registration_id uuid,
    order_id uuid,
    stripe_session_id character varying(255) NOT NULL,
    stripe_payment_id character varying(255),
    amount integer NOT NULL,
    currency character varying(3) DEFAULT 'eur'::character varying NOT NULL,
    status public."PaymentStatus" DEFAULT 'pending'::public."PaymentStatus" NOT NULL,
    description text,
    metadata jsonb,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products (
    id uuid NOT NULL,
    slug character varying(100) NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    price integer NOT NULL,
    compare_at_price integer,
    currency character varying(3) DEFAULT 'eur'::character varying NOT NULL,
    stock integer DEFAULT 0 NOT NULL,
    low_stock_threshold integer DEFAULT 5 NOT NULL,
    track_inventory boolean DEFAULT true NOT NULL,
    has_variants boolean DEFAULT false NOT NULL,
    variants jsonb,
    category character varying(100),
    tags text[],
    images jsonb,
    meta_title character varying(255),
    meta_description text,
    status character varying(20) DEFAULT 'draft'::character varying NOT NULL,
    featured boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: waiver_acceptances; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.waiver_acceptances (
    id uuid NOT NULL,
    event_id uuid NOT NULL,
    waiver_version character varying(50) NOT NULL,
    participant_full_name character varying(255) NOT NULL,
    participant_document_id character varying(50) NOT NULL,
    participant_birth_date date,
    waiver_text_hash character varying(64) NOT NULL,
    accepted_at timestamp(3) without time zone NOT NULL,
    ip_address character varying(45),
    user_agent text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    event_registration_id uuid,
    member_id uuid
);


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
c4472ddb-5dbb-47c5-aac5-e29a506b28b7	30a7d51ac4083c64d3d136fb26f258429ee701756892af80546f116b92035fff	2025-12-16 09:40:41.338781+00	20251216094040_init	\N	\N	2025-12-16 09:40:40.966251+00	1
\.


--
-- Data for Name: event_registrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.event_registrations (id, event_id, member_id, participant_name, participant_email, participant_phone, custom_data, status, privacy_accepted, privacy_accepted_at, privacy_policy_version, whatsapp_consent, whatsapp_consent_at, marketing_consent, marketing_consent_at, marketing_revoked_at, registered_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.events (id, slug, name, description, event_date, location, max_participants, current_participants, price, currency, requires_member, member_discount, custom_fields, whatsapp_group, status, image_url, meta_description, created_at, updated_at) FROM stdin;
ba063181-9a20-466d-9400-246842b547a0	misa-2026	MISA - Ritual Furtivo	Evento exclusivo de trail running nocturno en la montaña	2026-01-23 19:00:00	Ubicación secreta - Coordenadas 2h antes	100	0	2000	eur	f	0	{"shirt_size": true, "emergency_contact": false}	https://chat.whatsapp.com/tu-grupo-misa	published	\N	\N	2025-12-16 09:47:49.562	2025-12-16 09:47:49.562
\.


--
-- Data for Name: headquarters; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.headquarters (id, name, code, city, phone, email, membership_prices, status, created_at, updated_at) FROM stdin;
fd24b080-e070-4959-987a-5ba9ba41abaf	Proyecto Cumbre Málaga	MAL	Málaga	692185193	info@proyectocumbre.com	{"basic": 50, "family": 120, "premium": 80}	active	2025-12-16 09:45:15.243	2025-12-16 09:45:15.243
\.


--
-- Data for Name: members; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.members (id, headquarters_id, member_number, email, first_name, last_name, birth_date, dni, sex, phone, emergency_phone, emergency_contact_name, province, city, address, postal_code, shirt_size, hoodie_size, pants_size, license_type, fedme_license_number, fedme_status, membership_status, membership_start_date, membership_end_date, privacy_accepted, privacy_accepted_at, privacy_accepted_ip, privacy_policy_version, marketing_consent, marketing_consent_at, marketing_revoked_at, whatsapp_consent, whatsapp_consent_at, whatsapp_revoked_at, deleted_at, admin_notes, created_at, updated_at) FROM stdin;
c6afff6e-4e60-4cbb-b0c6-49832ad30f7b	fd24b080-e070-4959-987a-5ba9ba41abaf	MAL-2025-0004	carlirix47@gmail.com	Carlos	Ruiz de Mier Mora	1996-09-29	44666333B	M	690336357	626645547	Cristina Mora Lima	Málaga	Málaga	Calle Galicia, 3	29018	XL	\N	\N	b	\N	pending	active	2025-12-14	2026-12-14	t	2025-12-14 16:33:39.652	104.28.88.120	1.0	t	2025-12-14 16:33:42.988	\N	t	2025-12-14 16:33:39.652	\N	\N	Pago completado el 2025-12-14T16:34:05.375Z. Stripe Session: cs_live_b1FxNU5qqGkLk2Th1CiRA8AgFbfjpKsnF4BlZN4b6btAk2f8rO7BQTtUxX	2025-12-14 16:33:42.99	2025-12-14 16:34:05.704
80caa95d-16d4-4a02-94f6-d6254be4f335	fd24b080-e070-4959-987a-5ba9ba41abaf	MAL-2025-0005	catpower1992@gmail.clm	Ana	Rueda Sánchez	1992-01-12	44666637Q	F	667008641	610757860	Juan Rueda	Malaga	Málaga	Calle camelias	29730	L	\N	\N	b	\N	pending	active	2025-12-14	2026-12-14	t	2025-12-14 19:09:16.422	176.87.30.158	1.0	t	2025-12-14 19:09:19.468	\N	t	2025-12-14 19:09:16.422	\N	\N	Pago completado el 2025-12-14T19:09:46.439Z. Stripe Session: cs_live_b1iIhkSfLg0tnRgyGNXDD4wOavkqNM8DvH89jsaYwk4W5yGSRsZQjT5rO2	2025-12-14 19:09:19.469	2025-12-14 19:09:46.769
516d18f4-cd4e-4f33-8136-0448c8fc09fa	fd24b080-e070-4959-987a-5ba9ba41abaf	MAL-2025-0006	olimpiafn@gmail.com	Olimpia	Fernández Fernández	1992-11-25	25737665K	F	667986490	647711315	Olimpia Fernández Castillo	Málaga	Alhaurín de la Torre	C./ Océano Atlántico 27	29130	XS	\N	\N	b	\N	pending	active	2025-12-15	2026-12-15	t	2025-12-15 08:48:10.746	46.6.214.48	1.0	t	2025-12-15 08:48:14.611	\N	t	2025-12-15 08:48:10.746	\N	\N	Pago completado el 2025-12-15T08:49:38.415Z. Stripe Session: cs_live_b18O6NIZcjpLdekdbf06Jd7BbK7suYSs6WvaPZupxQZzNEw4gGg0b5D4Ep	2025-12-15 08:48:14.613	2025-12-15 20:58:11.583
f7331f97-f199-4a84-aec8-10c256fa5d33	fd24b080-e070-4959-987a-5ba9ba41abaf	MAL-2025-0008	mjc00005@gmail.com	Manuel	Jimenez Carrasco	1987-01-01	77330199J	M	692085193	\N	Manuel Jimenez Carrasco	Málaga	Malaga	Paseo de los tilos num67 2º1	29006	S	\N	\N	a_plus	\N	pending	pending	\N	\N	t	2025-12-15 22:20:20.893	::1	1.0	t	2025-12-15 22:20:21.714	\N	t	2025-12-15 22:20:20.893	\N	\N	\N	2025-12-15 21:20:32.902	2025-12-15 22:20:21.715
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_items (id, order_id, product_id, product_name, product_slug, variant_data, quantity, unit_price, total_price, created_at) FROM stdin;
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.orders (id, order_number, member_id, customer_email, customer_name, customer_phone, shipping_address, subtotal, shipping_cost, tax, discount, total, currency, status, tracking_number, shipped_at, delivered_at, customer_notes, admin_notes, privacy_policy_version, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payments (id, payment_type, member_id, event_registration_id, order_id, stripe_session_id, stripe_payment_id, amount, currency, status, description, metadata, created_at, updated_at) FROM stdin;
b9025ccf-4cd4-47af-a2fc-47f3c12ad94c	membership	c6afff6e-4e60-4cbb-b0c6-49832ad30f7b	\N	\N	cs_live_b1FxNU5qqGkLk2Th1CiRA8AgFbfjpKsnF4BlZN4b6btAk2f8rO7BQTtUxX	pi_3SeIFB42lPzOUver1fD2K70k	11600	eur	completed	Membresía - Licencia b	\N	2025-12-14 16:33:47.555	2025-12-14 16:34:05.906
54693207-7bbd-4cd8-aa29-9ee12d218003	membership	80caa95d-16d4-4a02-94f6-d6254be4f335	\N	\N	cs_live_b1iIhkSfLg0tnRgyGNXDD4wOavkqNM8DvH89jsaYwk4W5yGSRsZQjT5rO2	pi_3SeKfq42lPzOUver0p4HhxYy	11600	eur	completed	Membresía - Licencia b	\N	2025-12-14 19:09:31.793	2025-12-14 19:09:46.973
7129af17-e05a-455a-963d-1939e69ae6ca	membership	516d18f4-cd4e-4f33-8136-0448c8fc09fa	\N	\N	cs_live_b18O6NIZcjpLdekdbf06Jd7BbK7suYSs6WvaPZupxQZzNEw4gGg0b5D4Ep	pi_3SeXTF42lPzOUver1KI0pbPM	11600	eur	completed	Membresía - Licencia b	\N	2025-12-15 08:48:25.931	2025-12-15 08:49:38.939
0e34d265-67b0-470c-9df4-9e4424674329	membership	f7331f97-f199-4a84-aec8-10c256fa5d33	\N	\N	cs_test_a1UrfcR8CJY8MMmlDnBDMrNiAjzhDRfgxrc9fuuxjYeatWumtkoqVvDlPQ	\N	500	eur	pending	🧪 TEST - Membresía - Licencia a	\N	2025-12-15 21:20:35.795	2025-12-15 21:20:35.795
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.products (id, slug, name, description, price, compare_at_price, currency, stock, low_stock_threshold, track_inventory, has_variants, variants, category, tags, images, meta_title, meta_description, status, featured, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: waiver_acceptances; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.waiver_acceptances (id, event_id, waiver_version, participant_full_name, participant_document_id, participant_birth_date, waiver_text_hash, accepted_at, ip_address, user_agent, created_at, updated_at, event_registration_id, member_id) FROM stdin;
\.


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: event_registrations event_registrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event_registrations
    ADD CONSTRAINT event_registrations_pkey PRIMARY KEY (id);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: headquarters headquarters_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.headquarters
    ADD CONSTRAINT headquarters_pkey PRIMARY KEY (id);


--
-- Name: members members_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: waiver_acceptances waiver_acceptances_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.waiver_acceptances
    ADD CONSTRAINT waiver_acceptances_pkey PRIMARY KEY (id);


--
-- Name: event_registrations_event_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX event_registrations_event_id_idx ON public.event_registrations USING btree (event_id);


--
-- Name: event_registrations_marketing_consent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX event_registrations_marketing_consent_idx ON public.event_registrations USING btree (marketing_consent);


--
-- Name: event_registrations_member_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX event_registrations_member_id_idx ON public.event_registrations USING btree (member_id);


--
-- Name: event_registrations_participant_email_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX event_registrations_participant_email_idx ON public.event_registrations USING btree (participant_email);


--
-- Name: event_registrations_privacy_accepted_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX event_registrations_privacy_accepted_idx ON public.event_registrations USING btree (privacy_accepted);


--
-- Name: event_registrations_privacy_policy_version_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX event_registrations_privacy_policy_version_idx ON public.event_registrations USING btree (privacy_policy_version);


--
-- Name: event_registrations_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX event_registrations_status_idx ON public.event_registrations USING btree (status);


--
-- Name: events_event_date_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX events_event_date_idx ON public.events USING btree (event_date);


--
-- Name: events_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX events_slug_idx ON public.events USING btree (slug);


--
-- Name: events_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX events_slug_key ON public.events USING btree (slug);


--
-- Name: events_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX events_status_idx ON public.events USING btree (status);


--
-- Name: headquarters_code_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX headquarters_code_idx ON public.headquarters USING btree (code);


--
-- Name: headquarters_code_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX headquarters_code_key ON public.headquarters USING btree (code);


--
-- Name: headquarters_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX headquarters_status_idx ON public.headquarters USING btree (status);


--
-- Name: members_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX members_created_at_idx ON public.members USING btree (created_at DESC);


--
-- Name: members_deleted_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX members_deleted_at_idx ON public.members USING btree (deleted_at);


--
-- Name: members_dni_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX members_dni_idx ON public.members USING btree (dni);


--
-- Name: members_email_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX members_email_idx ON public.members USING btree (email);


--
-- Name: members_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX members_email_key ON public.members USING btree (email);


--
-- Name: members_fedme_license_number_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX members_fedme_license_number_key ON public.members USING btree (fedme_license_number);


--
-- Name: members_headquarters_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX members_headquarters_id_idx ON public.members USING btree (headquarters_id);


--
-- Name: members_marketing_consent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX members_marketing_consent_idx ON public.members USING btree (marketing_consent);


--
-- Name: members_member_number_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX members_member_number_idx ON public.members USING btree (member_number);


--
-- Name: members_member_number_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX members_member_number_key ON public.members USING btree (member_number);


--
-- Name: members_membership_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX members_membership_status_idx ON public.members USING btree (membership_status);


--
-- Name: members_privacy_accepted_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX members_privacy_accepted_idx ON public.members USING btree (privacy_accepted);


--
-- Name: members_privacy_policy_version_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX members_privacy_policy_version_idx ON public.members USING btree (privacy_policy_version);


--
-- Name: order_items_order_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX order_items_order_id_idx ON public.order_items USING btree (order_id);


--
-- Name: order_items_product_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX order_items_product_id_idx ON public.order_items USING btree (product_id);


--
-- Name: orders_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX orders_created_at_idx ON public.orders USING btree (created_at DESC);


--
-- Name: orders_customer_email_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX orders_customer_email_idx ON public.orders USING btree (customer_email);


--
-- Name: orders_member_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX orders_member_id_idx ON public.orders USING btree (member_id);


--
-- Name: orders_order_number_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX orders_order_number_idx ON public.orders USING btree (order_number);


--
-- Name: orders_order_number_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX orders_order_number_key ON public.orders USING btree (order_number);


--
-- Name: orders_privacy_policy_version_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX orders_privacy_policy_version_idx ON public.orders USING btree (privacy_policy_version);


--
-- Name: orders_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX orders_status_idx ON public.orders USING btree (status);


--
-- Name: payments_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payments_created_at_idx ON public.payments USING btree (created_at DESC);


--
-- Name: payments_event_registration_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payments_event_registration_id_idx ON public.payments USING btree (event_registration_id);


--
-- Name: payments_event_registration_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX payments_event_registration_id_key ON public.payments USING btree (event_registration_id);


--
-- Name: payments_member_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payments_member_id_idx ON public.payments USING btree (member_id);


--
-- Name: payments_order_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payments_order_id_idx ON public.payments USING btree (order_id);


--
-- Name: payments_payment_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payments_payment_type_idx ON public.payments USING btree (payment_type);


--
-- Name: payments_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payments_status_idx ON public.payments USING btree (status);


--
-- Name: payments_stripe_session_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX payments_stripe_session_id_idx ON public.payments USING btree (stripe_session_id);


--
-- Name: payments_stripe_session_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX payments_stripe_session_id_key ON public.payments USING btree (stripe_session_id);


--
-- Name: products_category_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX products_category_idx ON public.products USING btree (category);


--
-- Name: products_featured_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX products_featured_idx ON public.products USING btree (featured);


--
-- Name: products_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX products_slug_idx ON public.products USING btree (slug);


--
-- Name: products_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX products_slug_key ON public.products USING btree (slug);


--
-- Name: products_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX products_status_idx ON public.products USING btree (status);


--
-- Name: waiver_acceptances_accepted_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX waiver_acceptances_accepted_at_idx ON public.waiver_acceptances USING btree (accepted_at DESC);


--
-- Name: waiver_acceptances_event_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX waiver_acceptances_event_id_idx ON public.waiver_acceptances USING btree (event_id);


--
-- Name: waiver_acceptances_event_id_participant_document_id_waiver__key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX waiver_acceptances_event_id_participant_document_id_waiver__key ON public.waiver_acceptances USING btree (event_id, participant_document_id, waiver_version);


--
-- Name: waiver_acceptances_event_registration_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX waiver_acceptances_event_registration_id_idx ON public.waiver_acceptances USING btree (event_registration_id);


--
-- Name: waiver_acceptances_member_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX waiver_acceptances_member_id_idx ON public.waiver_acceptances USING btree (member_id);


--
-- Name: waiver_acceptances_participant_document_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX waiver_acceptances_participant_document_id_idx ON public.waiver_acceptances USING btree (participant_document_id);


--
-- Name: waiver_acceptances_waiver_version_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX waiver_acceptances_waiver_version_idx ON public.waiver_acceptances USING btree (waiver_version);


--
-- Name: event_registrations event_registrations_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event_registrations
    ADD CONSTRAINT event_registrations_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: event_registrations event_registrations_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event_registrations
    ADD CONSTRAINT event_registrations_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: members members_headquarters_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_headquarters_id_fkey FOREIGN KEY (headquarters_id) REFERENCES public.headquarters(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_items order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: orders orders_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: payments payments_event_registration_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_event_registration_id_fkey FOREIGN KEY (event_registration_id) REFERENCES public.event_registrations(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: payments payments_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: payments payments_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: waiver_acceptances waiver_acceptances_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.waiver_acceptances
    ADD CONSTRAINT waiver_acceptances_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: waiver_acceptances waiver_acceptances_event_registration_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.waiver_acceptances
    ADD CONSTRAINT waiver_acceptances_event_registration_id_fkey FOREIGN KEY (event_registration_id) REFERENCES public.event_registrations(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: waiver_acceptances waiver_acceptances_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.waiver_acceptances
    ADD CONSTRAINT waiver_acceptances_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.members(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict uanfZN4faiOJpCdFmecz7sM4BDEYIic5NDS2VafHmqbsUCcc71TFv6epVliTNTx

