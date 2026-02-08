from rest_framework.pagination import PageNumberPagination


class MyCompaniesPagination(PageNumberPagination):
    """
    Pagination strategy for listing companies where the user is a member.

    - Default: 10 per page
    - Allows client override via ?page_size=
    - Hard cap prevents abuse
    """
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 50