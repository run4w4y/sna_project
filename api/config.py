from sqlalchemy.engine.url import URL

class db:
    username = 'postgres'
    password = 'postgres'
    host = 'postgres'
    port = 5432
    database = 'sna_project'
    query_sync = None
    query = None

    @classmethod
    def _get_url_object(cls, driver: str):
        return URL(
            driver,
            username=cls.username,
            password=cls.password,
            host=cls.host,
            port=cls.port,
            database=cls.database,
            query=cls.query_sync if driver == 'postgresql' else cls.query
        )

    @classmethod
    def get_async_url(cls):
        return cls._get_url_object('postgresql+asyncpg')

    @classmethod
    def get_async_url_str(cls):
        return cls.get_async_url().render_as_string(hide_password=False).replace('%', '%%')

    @classmethod
    def get_sync_url(cls):
        return cls._get_url_object('postgresql')

    @classmethod
    def get_sync_url_str(cls):
        return cls.get_sync_url().render_as_string(hide_password=False).replace('%', '%%')

class hypercorn:
    bind_ip = '0.0.0.0'
    bind_port = 8080

class sqlalchemy:
    pool_size = 20
    max_overflow = 9

