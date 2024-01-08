package org.tools;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<EbayProduct, Long> {
    EbayProduct findFirstByBuyUrlIsNull();
}
