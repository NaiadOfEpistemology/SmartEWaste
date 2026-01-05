package smart_e_waste.smartEwaste.dto;

import lombok.Data;
import java.util.List;
import smart_e_waste.smartEwaste.entity.EwasteRequest;
import smart_e_waste.smartEwaste.entity.EwasteAudit;

@Data
public class HistoryResponse {
    private List<EwasteRequest> pending;
    private List<EwasteAudit> completed;
}
